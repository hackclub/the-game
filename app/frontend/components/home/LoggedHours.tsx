export default function LoggedHours({ totalProjectTime }: { totalProjectTime: number }) {
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
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-gray-700 text-lg font-semibold text-center mb-4">
        Time Logged
      </h2>
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
      <p className="text-center text-sm text-gray-500 mt-3">hours : minutes : seconds</p>
    </div>
  );
}

function FlipDigit({ digit }: { digit: number }) {
  return (
    <div className="bg-gray-900 w-10 h-14 sm:w-12 sm:h-16 rounded flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gray-700" />
      <span className="text-white text-3xl sm:text-4xl font-bold">{digit}</span>
    </div>
  );
}

function Colon() {
  return (
    <div className="flex flex-col gap-2 px-1">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
    </div>
  );
}
