import Layout from "@/layouts/layout";
import ReviewForm from "@/components/projects/ReviewForm";
import PageHeading from "@/components/layout/PageHeading";

import type { ProjectReview } from "@/interfaces/project_review";
import type { Project } from "@/interfaces/project";

export default function EditReview({
  review,
  project,
}: {
  review: ProjectReview;
  project: Project;
}) {
  return (
    <Layout>
      <PageHeading
        eyebrow={project?.title ?? "Project"}
        title={`Review on ${new Date(review.created_at).toLocaleDateString()}`}
      />

      <ReviewForm project={project} review={review} />
    </Layout>
  );
}
