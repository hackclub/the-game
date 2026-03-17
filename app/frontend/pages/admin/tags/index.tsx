import Layout from "@/layouts/layout";
import { Link } from "@inertiajs/react";
import { ProjectTag } from "@/interfaces/project_tag";
import TagForm from "@/components/admin/tags/TagForm";

export default function Announcements({ tags }: { tags: ProjectTag[] }) {
  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold">Project Tags</h1>
      <div className="flex flex-col gap-5">
        {tags.map((tag) => (
          <div className="rounded-md border border-black bg-white p-4">
            <p className="font-bold">{tag.name}</p>
            <p>
              <a
                className="text-blue-500 underline"
                href={`/admin/tags/${tag.id}/edit`}
              >
                Edit
              </a>{" "}
              |{" "}
              <Link
                className="cursor-pointer text-blue-500 underline"
                href={`/admin/tags/${tag.id}`}
                method="delete"
              >
                Delete
              </Link>
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-6 text-2xl font-bold">Create Tag</h2>

      <TagForm />
    </Layout>
  );
}
