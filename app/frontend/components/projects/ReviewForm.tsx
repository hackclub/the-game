import { useForm } from "@inertiajs/react";
import { useState, useRef } from "react";
import { Project } from "@/interfaces/project";
import { ProjectReview } from "@/interfaces/project_review";

const QUICK_RESPONSES = [
  {
    label: "No readme",
    text: "Hi! You need to include a proper README for your project. This should include a short description of the project, how you built it, and instructions on how to run/play/experience it. Feel free to resubmit when you've done this!",
  },
  {
    label: "Double-dipping",
    text: "Hey, it looks like you submitted this project to both Hack Club The Game and another YSWS program, which isn't allowed. Feel free to create and submit an original project just for Hack Club: The Game :) - ask in #hack-club-the-game if you need help!",
  },
  {
    label: "Excessive AI-usage",
    text: `It looks like your submission relied on AI for its creation. We respect the value of AI as a coding tool, but a Hack Club project should be something that, when you look at it, you feel proud of how hard you worked to ship it. If you are using AI to help you code, then that means manually reviewing and adjusting the code so that the finished project is polished. You should also keep the use of AI to generally under 30% of your total project's code!
    
    Keep working until you have something that you can honestly say is your best work! Add a couple of features yourself, and once you feel confident that you've done the work to make this project your own, feel free to submit again! See slide 17 of https://hack.club/hctg/guide for more context.`,
  },
] as const;

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
  const [showQuickResponses, setShowQuickResponses] = useState(false);

  function insertQuickResponse(text: string) {
    const field =
      data.review_type === "comment" && adminOnly ? "admin_content" : "content";
    const current = data[field];
    setData(field, current ? `${current}\n\n${text}` : text);
    setShowQuickResponses(false);
  }

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
      <div className="relative">
        <button
          type="button"
          className="cursor-pointer border border-[#cacaca] bg-[#d9d9d9] px-4 py-2 text-sm font-medium hover:bg-[#ccc]"
          onClick={() => setShowQuickResponses(!showQuickResponses)}
        >
          Quick responses {showQuickResponses ? "▲" : "▼"}
        </button>
        {showQuickResponses && (
          <div className="absolute z-10 mt-1 flex flex-col border border-[#cacaca] bg-white shadow-md">
            {QUICK_RESPONSES.map((response) => (
              <button
                key={response.label}
                type="button"
                className="cursor-pointer px-4 py-2 text-left text-sm hover:bg-[#e8e8e8]"
                onClick={() => insertQuickResponse(response.text)}
              >
                {response.label}
              </button>
            ))}
          </div>
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
