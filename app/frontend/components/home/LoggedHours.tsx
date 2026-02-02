export default function LoggedHours({
  totalProjectTime,
}: {
  totalProjectTime: number;
}) {
  const hours = Math.floor(totalProjectTime / 3600);
  const minutes = Math.floor((totalProjectTime % 3600) / 60);
  const seconds = totalProjectTime % 60;

  const digits = [
    Math.floor(hours / 10),
    hours % 10,
    Math.floor(minutes / 10),
    minutes % 10,
    Math.floor(seconds / 10),
    seconds % 10,
  ];

  return (
    <div className="rounded-lg">
      <h2 className="mb-4 text-center text-lg font-semibold">Time Logged</h2>
      <div className="flex items-center justify-center gap-1">
        <FlipDigit digit={digits[0]} />
        <FlipDigit digit={digits[1]} />
        <Colon />
        <FlipDigit digit={digits[2]} />
        <FlipDigit digit={digits[3]} />
        <Colon />
        <FlipDigit digit={digits[4]} />
        <FlipDigit digit={digits[5]} />
      </div>
      <p className="mt-3 text-center text-sm text-gray-300">
        hours : minutes : seconds
      </p>
    </div>
  );
}

function FlipDigit({ digit }: { digit: number }) {
  return (
    <div className="relative flex h-14 w-10 items-center justify-center overflow-hidden rounded bg-gray-900 sm:h-16 sm:w-12">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gray-700" />
      <span className="text-3xl font-bold text-white sm:text-4xl">{digit}</span>
    </div>
  );
}

function Colon() {
  return (
    <div className="flex flex-col gap-2 px-1">
      <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
      <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
    </div>
  );
}
