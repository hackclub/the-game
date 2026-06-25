import type { Project, ProjectChange } from "@/interfaces/project";
import type { ProjectReview } from "@/interfaces/project_review";
import type { PublicUser } from "@/interfaces/user";
import { usePage, Link } from "@inertiajs/react";
import formatTime from "@/utils/formatTime";
import ReviewForm from "./ReviewForm";
import { humanize } from "@/utils/humanize";

export default function ProjectReviews({
  project,
  ships,
}: {
  project: Project & {
    user: PublicUser;
    reviews: (ProjectReview & { author: PublicUser })[];
  };
  ships: ProjectChange[];
}) {
  const { props } = usePage();

  const timeline = [
    ...project.reviews.map((review) => ({
      review,
    })),
    ...ships.map((ship) => ({
      ship,
    })),
  ];
  timeline.sort((a, b) => {
    const aDate = new Date(
      "review" in a ? a.review.created_at : a.ship.date,
    ).valueOf();
    const bDate = new Date(
      "review" in b ? b.review.created_at : b.ship.date,
    ).valueOf();

    return aDate - bDate;
  });

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
              timeline.map((item, index) => {
                if ("ship" in item) {
                  const ship = item.ship;

                  return (
                    <div className="flex gap-3" key={ship.id}>
                      <img
                        src={project.user.avatar}
                        alt={`Avatar of ${project.user.username}`}
                        className="h-10 w-10 rounded-md"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="leading-0.5">
                          <span className="font-bold">
                            {project.user.username}
                          </span>{" "}
                          <span className="italic">shipped</span>
                          <span className="text-sm">
                            <br></br>on {new Date(ship.date).toLocaleString()}
                          </span>
                        </p>
                        <p className="max-w-sm wrap-break-word">
                          {Object.entries(ship.diff).map((entry) => (
                            <p className="leading-tight">
                              <span className="text-base font-bold">
                                {humanize(entry[0])}
                              </span>
                              <br />{" "}
                              {entry[1][0] ? `"${entry[1][0]}"` : "empty"} -&gt;
                              "{entry[1][1]}"
                            </p>
                          ))}
                        </p>
                      </div>
                    </div>
                  );
                }

                if ("review" in item) {
                  const review = item.review;

                  return (
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
                          {review.pending_hq && (
                            <span className="ml-2 rounded-md bg-yellow-200 px-2 py-0.5 text-sm font-semibold text-yellow-800">
                              Pending HQ authorization
                            </span>
                          )}
                          <span className="text-sm">
                            <br></br>on{" "}
                            {new Date(review.created_at).toLocaleString()}
                          </span>
                        </p>
                        <p className="max-w-sm wrap-break-word">
                          {review.content}
                        </p>
                        {review.admin_content && (
                          <p className="rounded-md border-2 border-dashed border-orange-600 bg-orange-200 p-3">
                            {review.admin_content}
                          </p>
                        )}
                        {(props.user.is_reviewer ||
                          props.user.is_fulfiller ||
                          props.user.is_admin) && (
                          <div className="flex gap-3">
                            <Link
                              href={`/projects/${project.id}/reviews/${review.id}/edit`}
                              className="text-blue-500 underline"
                            >
                              Edit
                            </Link>
                            {props.user.is_admin && review.pending_hq && (
                              <>
                                <Link
                                  href={`/projects/${project.id}/reviews/${review.id}/publish`}
                                  className="cursor-pointer font-semibold text-green-600 underline"
                                  method="post"
                                  as="button"
                                >
                                  Authorize
                                </Link>
                                <Link
                                  href={`/projects/${project.id}/reviews/${review.id}/discard`}
                                  className="cursor-pointer text-red-500 underline"
                                  method="post"
                                  as="button"
                                >
                                  Discard
                                </Link>
                              </>
                            )}
                            {!review.pending_hq &&
                              (index == timeline.length - 1 ||
                                review.review_type === "comment") && (
                                <Link
                                  href={`/projects/${project.id}/reviews/${review.id}`}
                                  className="cursor-pointer text-red-500 underline"
                                  method="delete"
                                >
                                  {review.review_type === "comment"
                                    ? "Delete"
                                    : "Undo"}
                                </Link>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              })
            )}
          </div>

          {(props.user.is_reviewer ||
            props.user.is_fulfiller ||
            props.user.is_admin) &&
            (project.pending_hq ? (
              <p className="mt-6 rounded-md border-2 border-dashed border-yellow-600 bg-yellow-100 p-3 text-base text-yellow-800">
                {props.user.is_admin
                  ? "This project has an approval awaiting HQ authorization. Authorize or discard it above before placing a new review."
                  : "This project has an approval awaiting HQ authorization. An HQ reviewer needs to act on it before it can be reviewed further."}
              </p>
            ) : (
              <ReviewForm project={project} />
            ))}
        </>
      )}
    </div>
  );
}
