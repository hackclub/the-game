import type { Project } from "@/interfaces/project";
import type { ProjectReview } from "@/interfaces/project_review";
import type { PublicUser } from "@/interfaces/user";
import { usePage, Link } from "@inertiajs/react";
import formatTime from "@/utils/formatTime";
import ReviewForm from "./ReviewForm";

export default function ProjectReviews({
  project,
}: {
  project: Project & { reviews: (ProjectReview & { author: PublicUser })[] };
}) {
  const { props } = usePage();

  return (
    <div className="mt-8 flex w-full flex-col px-16 text-lg">
      <h2 className="smoothing-black mb-2 text-3xl font-bold tracking-[-0.02em]">
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
                        {review.review_type === "approval" &&
                          `for ${formatTime(review.approved_seconds)}`}
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
                    {(props.user.role === "reviewer" ||
                      props.user.role === "admin") && (
                      <Link
                        href={`/projects/${project.id}/reviews/${review.id}/edit`}
                        className="text-blue-500 underline"
                      >
                        Edit review
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {(props.user.role === "reviewer" || props.user.role === "admin") && (
            <ReviewForm project={project} />
          )}
        </>
      )}
    </div>
  );
}
