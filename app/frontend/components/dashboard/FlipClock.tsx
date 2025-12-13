interface FlipClockProps {
  title: string
  days?: number
  hours: number
  minutes: number
  seconds: number
}

function FlipDigit({ value }: { value: string }) {
  return (
    <div className="bg-gray-900 text-white text-4xl font-bold w-12 h-16 flex items-center justify-center rounded-md relative">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gray-700" />
      {value}
    </div>
  )
}

function Colon() {
  return (
    <div className="text-gray-900 text-4xl font-bold flex items-center px-1">:</div>
  )
}

export default function FlipClock({ title, days, hours, minutes, seconds }: FlipClockProps) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const h = pad(hours)
  const m = pad(minutes)
  const s = pad(seconds)

  return (
    <div className="bg-white border-4 border-black p-4">
      <div className="text-center font-bold text-lg tracking-wide mb-3">{title}</div>
      <div className="flex items-center justify-center gap-1">
        {days !== undefined && (
          <>
            <span className="bg-gray-900 text-white text-4xl font-bold px-3 h-16 flex items-center justify-center rounded-md relative">
              <div className="absolute inset-x-0 top-1/2 h-px bg-gray-700" />
              {days}
            </span>
            <span className="text-gray-900 text-sm font-bold px-1">D</span>
          </>
        )}
        <FlipDigit value={h[0]} />
        <FlipDigit value={h[1]} />
        <Colon />
        <FlipDigit value={m[0]} />
        <FlipDigit value={m[1]} />
        <Colon />
        <FlipDigit value={s[0]} />
        <FlipDigit value={s[1]} />
      </div>
    </div>
  )
}
