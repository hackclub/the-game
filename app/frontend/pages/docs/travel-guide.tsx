import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";

/* nvm this got scrapped sob */

export default function TravelGuidePage() {
  return (
    <Layout>
      <PageHeading
        title="Travel Guide"
        subtitle="Getting from the airport to the hostel."
      />
      <div className="px-6 py-8 xl:px-24 xl:py-16">
        <div className="flex flex-col gap-10">
          <section className="rounded-2xl border-2 border-black bg-white p-6">
            <h2 className="smoothing-black mb-3 text-3xl font-bold tracking-[-0.02em]">
              Hello!
            </h2>
            <p className="smoothing-black text-lg text-black/80">
              <strong>HACK CLUB: THE GAME</strong> — the travel guides.
              Welcome!
            </p>
          </section>

          <section className="rounded-2xl border-2 border-black bg-white p-6">
            <h2 className="smoothing-black mb-3 text-3xl font-bold tracking-[-0.02em]">
              JFK to Hostels International NYC
            </h2>
            <ol className="smoothing-black list-decimal space-y-3 pl-6 text-lg text-black/80">
              <li>
                From JFK, you will have to make a long walk. Please try to exit
                along <strong>Terminal 8</strong>.
              </li>
              <li>
                Proceed to the exit and walk to the{" "}
                <strong>Howard Beach-JFK Airport</strong> subway stop on the{" "}
                <strong>A train</strong>.
              </li>
              <li>
                <strong>NOTE:</strong> Please be aware that you will have to
                pay a $3.00 fare to ride the subway.
              </li>
              <li>
                Be sure you are on the{" "}
                <strong>Inwood-207 St / Northbound A train</strong>. Take the{" "}
                <strong>A train</strong> to{" "}
                <strong>Times Square-42nd Street</strong>. This will take
                approximately 1 hour and 12 minutes.
              </li>
              <li>
                From <strong>Times Square-42nd Street</strong>, transfer to the{" "}
                <strong>1 train</strong>. Follow the appropriate signs found at
                each point within the station complex to find the{" "}
                <strong>1 train</strong>.
              </li>
              <li>
                Once you are at the <strong>1 train platform</strong>, take the{" "}
                <strong>Bronx-bound / Northbound 1 train</strong> to{" "}
                <strong>103rd Street</strong>, located on{" "}
                <strong>Broadway</strong> and <strong>W 103rd St</strong>.
              </li>
              <li>
                From there, walk from <strong>Broadway</strong> to{" "}
                <strong>Amsterdam Ave</strong> on the same block until you
                reach the <strong>HI New York City Hostel</strong>.
              </li>
            </ol>
          </section>

          <section className="rounded-2xl border-2 border-black bg-white p-6">
            <h2 className="smoothing-black mb-3 text-3xl font-bold tracking-[-0.02em]">
              LaGuardia (LGA) to Hostels International NYC
            </h2>
            <ol className="smoothing-black list-decimal space-y-3 pl-6 text-lg text-black/80">
              <li>
                From LaGuardia Airport, exit through <strong>Terminal B</strong>
                .
              </li>
              <li>
                Travel to the{" "}
                <strong>Q72 Bus Stop at 94th Street / Ditmas Blvd</strong>,
                located between 94th Street and Ditmas Blvd.
              </li>
              <li>
                Take the <strong>Q72</strong> bus until you reach the bus stop
                called <strong>Junction Blvd / Roosevelt Av</strong>, located
                between Junction Blvd and 38th Avenue.
              </li>
              <li>
                After reaching the stop, walk to the train station called{" "}
                <strong>Junction Blvd</strong> with the <strong>7 train</strong>
                .
              </li>
              <li>
                <strong>NOTE:</strong> Please be aware that you will have to
                pay a $3.00 fare to ride the subway.
              </li>
              <li>
                Take the{" "}
                <strong>7 train on the Manhattan-bound / Southbound</strong>{" "}
                track until you reach the train station called{" "}
                <strong>Times Square-42nd Street</strong>. This will be
                approximately a 17-minute train ride, depending on whether
                there are delays or not.
              </li>
              <li>
                From <strong>Times Square-42nd Street</strong>, transfer to the{" "}
                <strong>1 train</strong>. Follow the signs to the{" "}
                <strong>1 train</strong>.
              </li>
              <li>
                Take the <strong>Bronx-bound / Northbound 1 train</strong> to{" "}
                <strong>103rd Street</strong>, located on{" "}
                <strong>Broadway</strong> and <strong>W 103rd St</strong>.
              </li>
              <li>
                From there, walk from <strong>Broadway</strong> to{" "}
                <strong>Amsterdam Ave</strong> on the same block until you
                reach the <strong>HI New York City Hostel</strong>.
              </li>
            </ol>
          </section>

          <section className="rounded-2xl border-2 border-black bg-white p-6">
            <h2 className="smoothing-black mb-3 text-3xl font-bold tracking-[-0.02em]">
              Newark (EWR) to Hostels International NYC
            </h2>
            <ol className="smoothing-black list-decimal space-y-3 pl-6 text-lg text-black/80">
              <li>
                From Newark, you will have to make a long walk. Please try to
                exit along <strong>Terminal C</strong>.
              </li>
            </ol>
          </section>
        </div>
      </div>
    </Layout>
  );
}
  