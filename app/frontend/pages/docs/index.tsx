import { Link } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";

const docs = [
  {
    name: "Travel Guide",
    href: "https://docs.google.com/document/d/1IXf5_JebDVnni9ngMVpHCDoI8IBAh0TjSeJzSLyrr7c/edit?tab=t.0",
    external: true,
  },
  { name: "Travel Packlist", href: "/docs/travel-packlist", external: false },
  { name: "FAQ", href: "/docs/faq", external: false },
  {
    name: "Parents Guide",
    href: "https://docs.google.com/presentation/d/e/2PACX-1vRbyFw3GUUjHqjjxkat-zf707zJVTgbPSbJ2bAlcSjhbiPpED02qxd55eHCjpNJSn0VmtsZjcZ-E62u/pub?start=false&loop=false&delayms=60000&slide=id.g3d8a56969ff_0_0",
    external: true,
  },
  {
    name: "Project Guide",
    href: "https://docs.google.com/document/d/1qaSabYkvaPVHtioIsBYAXtEobP4fbqHXZ3oyKS9RQa8/edit?tab=t.brcb3apznbb4",
    external: true,
  },
];

export default function DocsPage() {
  return (
    <Layout>
      <PageHeading title="Docs" subtitle="Everything you need to know." />

      <div className="flex flex-col gap-10 px-6 py-8 xl:px-24 xl:py-16">
        <div className="rounded-2xl border-2 border-black bg-white p-6">
          <h2 className="smoothing-black mb-3 text-3xl font-bold tracking-[-0.02em]">
            Overview
          </h2>
          <p className="smoothing-black text-lg text-black/80">
            {/* smtjh about docs uh idk its docs? */}
            The collection of docs you need to know everything about the online and in person event! 

          </p>
        </div>

        <div>
          <h2 className="smoothing-black mb-4 text-3xl font-bold tracking-[-0.02em]">
            Documents:
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {docs.map((doc) =>
              doc.external ? (
                <a
                  key={doc.href}
                  href={doc.href}
                  target="_blank"
                  rel="noreferrer"
                  className="smoothing-black flex items-center justify-between rounded-2xl border-2 border-black bg-[#fecb0d] p-6 text-2xl font-bold tracking-[-0.02em] text-black transition-transform hover:scale-[1.02]"
                >
                  {doc.name}
                  <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <Link
                  key={doc.href}
                  href={doc.href}
                  className="smoothing-black flex items-center justify-between rounded-2xl border-2 border-black bg-[#fecb0d] p-6 text-2xl font-bold tracking-[-0.02em] text-black transition-transform hover:scale-[1.02]"
                >
                  {doc.name}
                  <span aria-hidden="true">→</span>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
