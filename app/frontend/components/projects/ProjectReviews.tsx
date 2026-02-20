import type { Project } from "@/interfaces/project";
import type { ProjectReview } from "@/interfaces/project_review";
import type { PublicUser } from "@/interfaces/user";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function ProjectReviews({
  project,
}: {
  project: Project & { reviews: (ProjectReview & { author: PublicUser })[] };
}) {
  const { data, setData, post, reset, processing } = useForm({
    review_type: "comment",
    content: "",
    admin_content: "",
    approved_hours: Number((project.total_seconds / 3600).toPrecision(4)),
    high_quality: null as boolean | null,
  });
  const [adminOnly, setAdminOnly] = useState(false);
  const { props } = usePage();

  function submitReview(e: React.FormEvent) {
    e.preventDefault();

    post(`/projects/${project.id}/reviews`, {
      onSuccess: () => reset(),
    });
  }

  return (
    <div className="mt-8 flex w-full flex-col px-16">
      <h2 className="smoothing-black text-3xl font-bold tracking-[-0.02em]">
        Reviews
      </h2>
      {project.aasm_state === "pending" ? (
        <p className="text-xl">Ship your project so that we can review it!</p>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {project.reviews.length == 0 ? (
              <p className="text-xl">
                We haven't reviewed your project yet - give us some time!
              </p>
            ) : (
              project.reviews.map((review) => (
                <div className="flex gap-3" key={review.id}>
                  <img
                    src={review.author.avatar}
                    alt={`Avatar of ${review.author.username}`}
                    className="h-10 w-10 rounded-md"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="leading-0.5">
                      <span className="font-bold">
                        {review.author.username}
                      </span>{" "}
                      <span className="italic">
                        {review.review_type === "approval"
                          ? "approved"
                          : review.review_type === "rejection"
                            ? "rejected"
                            : "commented"}{" "}
                      </span>
                      <span className="text-sm">
                        <br></br>on{" "}
                        {new Date(review.created_at).toLocaleString()}
                      </span>
                    </p>
                    <p className="max-w-sm wrap-break-word">{review.content}</p>
                    {review.admin_content && (
                      <p className="rounded-md border-2 border-dashed border-orange-600 bg-orange-200 p-3">
                        {review.admin_content}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {(props.user.role === "reviewer" || props.user.role === "admin") && (
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
                        onChange={(e) =>
                          setData("high_quality", e.target.checked)
                        }
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
                Add review
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
