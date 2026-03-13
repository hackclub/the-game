import Layout from "@/layouts/layout";
import TagForm from "@/components/admin/tags/TagForm";
import { ProjectTag } from "@/interfaces/project_tag";

export default function EditTag({ tag }: { tag: ProjectTag }) {
  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold">Edit Tag</h1>
      <TagForm tag={tag} />
    </Layout>
  );
}
