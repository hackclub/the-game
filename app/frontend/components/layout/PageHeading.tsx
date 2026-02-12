import type { ReactNode } from "react";

type PageHeadingProps = {
  title: string;
  subtitle?: ReactNode;
  eyebrow?: string;
};

function HeadingSegment({
  text,
  backgroundClass,
  textClass,
  minWidth = true,
}: {
  text: string;
  backgroundClass: string;
  textClass: string;
  minWidth?: boolean;
}) {
  return (
    <div className="flex h-full">
      <div
        className={`relative flex h-full ${minWidth ? "min-w-xl" : ""} items-center px-10 md:px-16 ${backgroundClass}`}
      >
        <span
          className={`text-[48px] font-bold tracking-[-0.06em] ${textClass}`}
        >
          {text}
        </span>
      </div>

      <div
        className={`h-full w-8 ${backgroundClass}`}
        style={{ clipPath: "polygon(100% 50%, 0% 0%, 0% 100%)" }}
      />
    </div>
  );
}

export default function PageHeading({
  title,
  subtitle,
  eyebrow,
}: PageHeadingProps) {
  return (
    <div className="relative -ml-6 -translate-x-2">
      <div className="relative flex h-[72px] w-full items-center">
        {eyebrow ? (
          <>
            <HeadingSegment
              text={eyebrow}
              backgroundClass="z-10 shrink-0 bg-[#0f0f0f]"
              textClass="text-white smoothing-white"
              minWidth={false}
            />

            <HeadingSegment
              text={title}
              backgroundClass="-translate-x-8 z-0 flex-1 bg-[#fecb0d]"
              textClass="text-black smoothing-black"
            />
          </>
        ) : (
          <HeadingSegment
            text={title}
            backgroundClass="bg-[#0f0f0f]"
            textClass="text-white smoothing-white"
          />
        )}
      </div>
      {subtitle ? (
        <div className="smoothing-black mt-5 pl-16 text-xl leading-snug text-black/80">
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
