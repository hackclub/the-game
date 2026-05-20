import { Link } from "@inertiajs/react";
import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";

export default function TravelPacklistPage() {
  return (
    <Layout>
      <PageHeading
        title="Travel Packlist"
        subtitle="What to bring with you."
      />
      <div className="px-6 pt-6 xl:px-24 xl:pt-10">
        <Link
          href="/docs"
          className="smoothing-black inline-flex items-center gap-1 text-lg font-semibold text-black/80 hover:underline"
        >
          ← Back to docs
        </Link>
      </div>
      <div className="px-6 py-8 xl:px-24 xl:py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="smoothing-black mb-3 text-3xl font-bold tracking-[-0.02em]">
            Stuff to bring
          </h2>
          <ul className="smoothing-black list-disc space-y-1 pl-6 text-lg text-black/80">
            <li>ID and/or passport</li>
            <li>
              Medication (if needed, make sure to put that info on attend if you
              need it!)
            </li>
            <li>
              Clothes for 3 days
              <ul className="list-[circle] space-y-1 pl-6">
                <li>Running shoes!</li>
                <li>Some warm clothes as we are expecting cold weather</li>
                <li>Raincoat + umbrella</li>
              </ul>
            </li>
            <li>
              Toiletries (Toothbrush, Toothpaste, Crocs, Shampoo, body wash,
              etc.)
            </li>
            <li>Deodorant</li>
            <li>Reusable water bottle</li>
            <li>Extra money for memorabilia!</li>
            <li>
              Laptop + Charger
              <ul className="list-[circle] space-y-1 pl-6">
                <li>A power bank in case anything dies</li>
              </ul>
            </li>
            <li>
              Travel adapters (if you&apos;re not from the US and have a non-US
              charger)
            </li>
          </ul>

          <p className="smoothing-black mt-8 text-lg text-black/80">
            Check{" "}
            <a
              href="https://docs.google.com/document/d/1IXf5_JebDVnni9ngMVpHCDoI8IBAh0TjSeJzSLyrr7c/edit?tab=t.0#heading=h.f6b12pev08j3"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline"
            >
              our travel guide
            </a>{" "}
            for more.
          </p>
        </div>
      </div>
    </Layout>
  );
}
