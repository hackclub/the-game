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
    <div className="flex flex-col gap-4 items-start w-full">
      <div className="flex gap-4 lg:gap-8 min-h-16 lg:h-20 items-center w-full">
        <div className="bg-[#c93a1a] flex flex-col items-center justify-center rounded-full w-12 h-12 lg:w-16 lg:h-16 shrink-0">
          <p className="font-bold text-xl lg:text-3xl text-white leading-none">
            Q
          </p>
        </div>
        <p className="font-bold text-xl lg:text-3xl text-black leading-tight lg:leading-none tracking-[-0.08em] lg:tracking-[-2.56px]">
          {question}
        </p>
      </div>
      <div className="flex gap-4 lg:gap-8 items-start w-full">
        <div className="bg-[#eed02b] flex flex-col items-center justify-center rounded-full w-12 h-12 lg:w-16 lg:h-16 shrink-0">
          <p className="font-bold text-xl lg:text-3xl text-black leading-none">
            A
          </p>
        </div>
        <p className="flex-1 text-lg lg:text-3xl text-black leading-tight lg:leading-none tracking-[-0.04em] lg:tracking-[-1.12px]">
          {answer}
        </p>
      </div>
    </div>
  );
}
