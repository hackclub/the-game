import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Project } from "@/interfaces/project";
import { ProjectReview } from "@/interfaces/project_review";

export default function ReviewForm({
  project,
  review,
}: {
  project: Project;
  review?: ProjectReview;
}) {
  const seconds =
    review?.approved_seconds ??
    project.total_seconds - project.approved_seconds;

  const { data, setData, post, patch, reset, processing } = useForm({
    review_type: review?.review_type ?? "comment",
    content: review?.content ?? "",
    admin_content: review?.admin_content ?? "",
    approved_hours: Number((seconds / 3600).toPrecision(4)),
    high_quality: (project.high_quality ?? null) as boolean | null,
  });
  const [adminOnly, setAdminOnly] = useState(false);

  function submitReview(e: React.FormEvent) {
    e.preventDefault();

    if (review?.id) {
      patch(`/projects/${project.id}/reviews/${review.id}`);
    } else {
      post(`/projects/${project.id}/reviews`, {
        onSuccess: () => reset(),
      });
    }
  }

  return (
    <form
      className="mt-6 flex w-full flex-col gap-4 px-4 md:px-0"
      onSubmit={submitReview}
    >
      <div className="flex items-center gap-4">
        <select
          className="border-[#cacaca] bg-[#d9d9d9] py-2 pr-12 pl-6 text-lg outline-none"
          value={data.review_type}
          onChange={(e) => {
            setData("review_type", e.target.value);

            if (e.target.value !== "approval") {
              setData("high_quality", false);
            }
          }}
        >
          <option value="comment">Comment</option>
          {project.aasm_state === "submitted" && (
            <>
              <option value="rejection">Rejection</option>
              <option value="approval">Approval</option>
            </>
          )}
        </select>
        {data.review_type === "comment" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={adminOnly}
              onChange={(e) => {
                if (adminOnly) {
                  setData("content", data.admin_content);
                  setData("admin_content", "");
                } else {
                  setData("admin_content", data.content);
                  setData("content", "");
                }
                setAdminOnly(e.target.checked);
              }}
            />
            <label className="text-lg">Internal?</label>
          </div>
        )}
        {data.review_type === "approval" && (
          <>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.approved_hours}
                className="border-[#cacaca] bg-[#d9d9d9] px-4 py-2 text-xl outline-none"
                onChange={(e) => {
                  setData("approved_hours", Number(e.target.value));
                }}
              />
              <label className="text-lg">hours</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                value={(data.high_quality || false).toString()}
                onChange={(e) => setData("high_quality", e.target.checked)}
              />
              <label className="text-lg">High quality?</label>
            </div>
          </>
        )}
      </div>
      <textarea
        className="h-[117px] resize-none border-[#cacaca] bg-[#d9d9d9] p-4 text-xl outline-none"
        value={
          data.review_type === "comment" && adminOnly
            ? data.admin_content
            : data.content
        }
        onChange={(e) => {
          if (data.review_type === "comment" && adminOnly) {
            setData("admin_content", e.target.value);
          } else {
            setData("content", e.target.value);
          }
        }}
        required={data.review_type !== "comment"}
        placeholder={`Add your comment here - this will ${adminOnly && data.review_type === "comment" ? "only be visible to admins and reviewers" : "be shown to the author"}`}
      />
      {data.review_type !== "comment" && (
        <textarea
          className="h-[117px] resize-none border-[#cacaca] bg-[#d9d9d9] p-4 text-xl outline-none"
          value={data.admin_content}
          onChange={(e) => {
            setData("admin_content", e.target.value);
          }}
          required
          placeholder="Justify this review - this is only shown to admins and reviewers"
        />
      )}
      <button
        className="cursor-pointer bg-black px-6 py-2 text-lg font-bold text-white hover:bg-gray-800"
        disabled={processing}
      >
        {review ? "Update" : "Add"} review
      </button>
    </form>
  );
}
