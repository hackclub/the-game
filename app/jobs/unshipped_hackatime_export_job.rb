class UnshippedHackatimeExportJob < ApplicationJob
  queue_as :default

  def perform
    UnshippedHackatimeExport.write(status: "running", started_at: Time.current.iso8601, processed: 0)

    result = UnshippedHackatimeReport.generate(
      progress: ->(processed, total) {
        UnshippedHackatimeExport.write(status: "running", processed: processed, total: total)
      }
    )

    blob = ActiveStorage::Blob.create_and_upload!(
      io: StringIO.new(result[:csv]),
      filename: "unshipped-hackatime-#{Date.current.iso8601}.csv",
      content_type: "text/csv"
    )

    UnshippedHackatimeExport.write(
      status: "completed",
      rows_count: result[:rows_count],
      blob_signed_id: blob.signed_id,
      finished_at: Time.current.iso8601
    )
  rescue => e
    UnshippedHackatimeExport.write(status: "failed", error: e.message, finished_at: Time.current.iso8601)
    raise
  end
end
