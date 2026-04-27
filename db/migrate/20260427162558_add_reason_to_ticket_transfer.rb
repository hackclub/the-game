class AddReasonToTicketTransfer < ActiveRecord::Migration[8.1]
  def change
    add_column :ticket_transfers, :reason, :string, null: false
  end
end
