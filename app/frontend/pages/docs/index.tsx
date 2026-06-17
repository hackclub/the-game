import { useState } from "react";
import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";

const faqs = [
  {
    q: "What is Hack Club: The Game?",
    a: (
      <>
        Hack Club: The Game is a Hack Club event happening from May 22nd to May
        24th 2026 in New York City. You and 100 other Hack Clubbers from all
        over the world will come together in teams to complete challenges and
        conquer all of Manhattan. You&apos;ll explore the city, make new
        friendships, and embark on an adventure of a lifetime. It&apos;s
        inspired by the YouTube Series Jet Lag: The Game
      </>
    ),
  },
  {
    q: "When and where is this happening?",
    a: "Hack Club: The Game is happening in New York City from Friday, May 22nd to Sunday, May 24th 2026. You'll fly in Friday evening, and fly out Sunday evening.",
  },
  {
    q: "Who can participate?",
    a: "Anyone aged 13-18, who completes the required hours!",
  },
  {
    q: "How will the IRL event work?",
    a: "We don't want to spoil too many details, but it'll be a scavenger hunt",
  },
  {
    q: "Will accommodations, food, and game costs be covered?",
    a: "Yep! All living expenses, food, and game costs will be covered during the event. You'll be sleeping at our venues during the night, and be out in Manhattan during the day. We'll have pre and post-event stays in our shop if you need them.",
  },
  {
    q: "Are there travel stipends?",
    a: "Yes! Every additional hour worked after you hit 40 hours and qualify can be used towards a travel stipend at the rate of $8/h. You'll also be able to purchase pre/post event accommodation if you need it in the shop.",
  },
  {
    q: "How many people can attend?",
    a: "We're planning for 100 attendees. We'll do our best to accommodate everyone who qualifies and is able to come to the event. We're unable to guarantee capacity for more than 100. Don't worry about the event filling up before you qualify.",
  },
  {
    q: "I'm worried that I'll be unable to come to the event, will you have a shop?",
    a: "If you complete the requirements to attend HCTG, but are unable to join us IRL you can exchange the time spent for alternative prizes. You could spend your hard-earned tickets on the shop and get things (like: Laptops, dev boards, ear buds)",
  },
  {
    q: "I need a letter for visa applications, where can I get one?",
    a: (
      <>
        When you hit 20 hours, you can request a visa letter. You can apply for
        a visa letter at{" "}
        <a
          href="https://visas.hackclub.com"
          target="_blank"
          rel="noreferrer"
          className="font-semibold underline"
        >
          https://visas.hackclub.com
        </a>
        .
      </>
    ),
  },
  {
    q: "Is there any way to get an expedited letter for visa applications before I hit 20 hours?",
    a: (
      <>
        Yes, you can request a visa application letter earlier if any of your
        projects have a golden ticket. Golden tickets are given out by reviewers
        if they think your project is really cool and/or high-quality (no slop,
        no generic projects, etc.). After you receive a golden ticket, you can
        apply at{" "}
        <a
          href="https://visas.hackclub.com"
          target="_blank"
          rel="noreferrer"
          className="font-semibold underline"
        >
          https://visas.hackclub.com
        </a>
      </>
    ),
  },
  {
    q: "\uD83D\uDD34 When will projects be reviewed?",
    a: "It may take anywhere from three days to two weeks to review your project. Please be patient.",
  },
  {
    q: "What happens after I hit 40 hours?",
    a: "After you hit 40 hours, your projects will be reviewed after you ship your projects. Your projects will also be reviewed on a rolling basis if you ship projects before you hit 40 hours. When we review projects, we may deduct hours or disqualify them for being low-quality or fraudulent.",
  },
];

export default function DocsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Layout>
      <PageHeading title="Docs" subtitle="Everything you need to know." />

      <div className="flex flex-col gap-10 px-6 py-8 xl:px-24 xl:py-16">
        {/* Project Guide CTA */}
        <a
          href="https://docs.google.com/document/d/1qaSabYkvaPVHtioIsBYAXtEobP4fbqHXZ3oyKS9RQa8/edit?tab=t.brcb3apznbb4"
          target="_blank"
          rel="noreferrer"
          className="smoothing-black flex items-center justify-between rounded-2xl border-2 border-black bg-[#fecb0d] p-6 text-2xl font-bold tracking-[-0.02em] text-black transition-transform hover:scale-[1.02]"
        >
          <div>
            <span className="text-3xl">Project Guide</span>
            <p className="mt-1 text-lg font-normal text-black/70">
              Everything you need to know about submitting your project.
            </p>
          </div>
          <span aria-hidden="true" className="text-3xl">
            ↗
          </span>
        </a>

        {/* Submission guide note */}
        <div className="rounded-2xl border-2 border-black bg-white p-6">
          <p className="smoothing-black text-lg text-black/80">
            Question about project submissions? Check the submission guide{" "}
            <a
              href="https://hack.club/hctg-project-submission-guide"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline"
            >
              here
            </a>
            .
          </p>
        </div>

        {/* FAQ Accordion */}
        <div>
          <h2 className="smoothing-black mb-4 text-3xl font-bold tracking-[-0.02em]">
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border-2 border-black bg-white"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="flex w-full cursor-pointer items-center justify-between p-6 text-left"
                  >
                    <h3 className="smoothing-black pr-4 text-xl font-bold tracking-[-0.02em]">
                      {faq.q}
                    </h3>
                    <span
                      className={`shrink-0 text-2xl transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-200 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="smoothing-black px-6 pb-6 text-lg text-black/80">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help footer */}
        <div className="rounded-2xl border-2 border-black bg-white p-6">
          <p className="smoothing-black text-lg text-black/80">
            Have any other questions not answered here? Feel free to ask in our{" "}
            <a
              href="https://hackclub.enterprise.slack.com/archives/C0A9XULS1SL"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline"
            >
              help slack channel
            </a>
            , or email us at{" "}
            <a
              href="mailto:hctg@hackclub.com"
              className="font-semibold underline"
            >
              hctg@hackclub.com
            </a>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
}
