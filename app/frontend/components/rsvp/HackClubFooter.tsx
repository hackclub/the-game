export default function HackClubFooter() {
  return (
    <div className="relative z-10 w-full bg-[#1a1a2e] px-6 py-16 lg:px-40 lg:py-24">
      <div className="flex max-w-4xl flex-col gap-6">
        <h2 className="smoothing-white text-2xl font-bold tracking-[-0.03em] text-white lg:text-4xl">
          <span>A project by </span>
          <a
            href="https://hackclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#eed02b] underline transition-colors hover:text-[#c93a1a]"
          >
            Hack Club
          </a>
        </h2>

        <p className="smoothing-white text-lg leading-relaxed text-white/90 lg:text-[22px]">
          Hack Club is a 501(c)(3) nonprofit and network of 60k+ technical high
          schoolers. We believe you learn best by building so we're creating
          community and providing grants so you can make awesome projects. In
          the past few years, we've{" "}
          <a
            href="https://summer.hackclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-[#eed02b]"
          >
            partnered with GitHub to run Summer of Making
          </a>
          ,{" "}
          <a
            href="https://zephyr.hackclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-[#eed02b]"
          >
            ran a cross-country hackathon on a train across America
          </a>
          , and{" "}
          <a
            href="https://apocalypse.hackclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-[#eed02b]"
          >
            hosted Canada's largest high school hackathon
          </a>
          .
        </p>

        <p className="smoothing-white text-lg leading-relaxed tracking-[-0.03em] text-white/90 lg:text-2xl">
          At Hack Club, students aren't just learning, they're shipping.
        </p>
      </div>
    </div>
  );
}
