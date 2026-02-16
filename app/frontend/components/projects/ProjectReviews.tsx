import type { Project } from "@/interfaces/project";
import type { ProjectReview } from "@/interfaces/project_review";
import type { PublicUser } from "@/interfaces/user";
import { useForm, usePage } from "@inertiajs/react";

export default function ProjectReviews({
  project,
}: {
  project: Project & { reviews: (ProjectReview & { author: PublicUser })[] };
}) {
  const { data, setData, post, reset, processing } = useForm({
    review_type: "comment",
    content: "",
  });
  const { props } = usePage();

  function submitReview(e: React.FormEvent) {
    e.preventDefault();

    post(`/projects/${project.id}/reviews`, {
      onSuccess: () => reset(),
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Reviews</h2>
      {project.aasm_state === "pending" ? (
        <p>Ship your project so that we can review it!</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {project.reviews.length == 0 ? (
              <p>We haven't reviewed your project yet - give us some time!</p>
            ) : (
              project.reviews.map((review) => (
                <div className="flex gap-3" key={review.id}>
                  <img
                    src={review.author.avatar}
                    alt={`Avatar of ${review.author.username}`}
                    className="h-10 w-10 rounded-md"
                  />
                  <div>
                    <p>
                      <span className="font-bold">
                        {review.author.username}
                      </span>{" "}
                      <span className="italic">
                        {review.review_type === "approval"
                          ? "approved"
                          : review.review_type === "rejection"
                            ? "rejected"
                            : "commented"}
                      </span>
                    </p>
                    <p className="max-w-sm wrap-break-word">{review.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {props.user.role === "admin" && (
            <form
              className="mt-5 flex flex-col items-start gap-2"
              onSubmit={submitReview}
            >
              <select
                value={data.review_type}
                onChange={(e) => setData("review_type", e.target.value)}
              >
                <option value="comment">Comment</option>
                <option value="rejection">Rejection</option>
                <option value="approval">Approval</option>
              </select>
              <textarea
                className="min-w-md rounded-md"
                value={data.content}
                onChange={(e) => setData("content", e.target.value)}
                placeholder="Add your comment here - this will be shown to the author"
              />
              <button
                className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white"
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
