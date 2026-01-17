import type { ReactNode } from "react";

type QuestionAnswerProps = {
  question?: string;
  answer?: string | ReactNode;
};

export default function QuestionAnswer({
  question,
  answer,
}: QuestionAnswerProps) {
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex min-h-16 w-full items-center gap-4 lg:h-20 lg:gap-8">
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full bg-[#c93a1a] lg:h-16 lg:w-16">
          <p className="text-xl leading-none font-bold text-white lg:text-3xl">
            Q
          </p>
        </div>
        <p className="text-xl leading-tight font-bold tracking-[-0.08em] text-black lg:text-3xl lg:leading-none lg:tracking-[-2.56px]">
          {question}
        </p>
      </div>
      <div className="flex w-full items-start gap-4 lg:gap-8">
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full bg-[#eed02b] lg:h-16 lg:w-16">
          <p className="text-xl leading-none font-bold text-black lg:text-3xl">
            A
          </p>
        </div>
        <p className="flex-1 text-lg leading-tight tracking-[-0.04em] text-black lg:text-3xl lg:leading-none lg:tracking-[-1.12px]">
          {answer}
        </p>
      </div>
    </div>
  );
}
