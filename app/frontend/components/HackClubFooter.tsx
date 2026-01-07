export default function HackClubFooter() {
  return (
    <div className="relative z-10 w-full px-6 lg:px-40 py-16 lg:py-24 bg-[#1a1a2e]">
      <div className="flex flex-col gap-6 max-w-4xl">
        <h2 className="text-2xl lg:text-4xl tracking-[-0.04em] text-white">
          <span className="font-normal">A project by </span>
          <a
            href="https://hackclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#eed02b] underline hover:text-[#c93a1a] transition-colors"
          >
            Hack Club
          </a>
        </h2>

        <p className="text-lg lg:text-2xl tracking-[-0.04em] text-white/90 leading-relaxed">
          Hack Club is a 501(c)(3) nonprofit and network of 60k+ technical high
          schoolers. We believe you learn best by building so we're creating
          community and providing grants so you can make awesome projects. In
          the past few years, we've{" "}
          <a
            href="https://summer.hackclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#eed02b] transition-colors"
          >
            partnered with GitHub to run Summer of Making
          </a>
          ,{" "}
          <a
            href="https://zephyr.hackclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#eed02b] transition-colors"
          >
            ran a cross-country hackathon on a train across America
          </a>
          , and{" "}
          <a
            href="https://apocalypse.hackclub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#eed02b] transition-colors"
          >
            hosted Canada's largest high school hackathon
          </a>
          .
        </p>

        <p className="text-lg lg:text-2xl tracking-[-0.04em] text-white/90 leading-relaxed">
          At Hack Club, students aren't just learning, they're shipping.
        </p>
      </div>
    </div>
  );
}
