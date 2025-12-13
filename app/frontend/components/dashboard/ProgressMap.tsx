interface Milestone {
  name: string
  completed: boolean
  current: boolean
}

interface ProgressMapProps {
  milestones: Milestone[]
}

export default function ProgressMap({ milestones }: ProgressMapProps) {
  return (
    <div className="bg-white border-4 border-black p-6">
      <h2 className="text-center font-bold text-2xl mb-8">MAP</h2>
      
      <div className="relative flex items-center justify-between px-4">
        <div className="absolute left-8 right-8 top-1/2 h-1 bg-blue-600 -translate-y-1/2 z-0" />
        <div className="absolute left-0 top-1/2 w-2 h-4 bg-blue-600 -translate-y-1/2" />
        <div className="absolute right-0 top-1/2 w-2 h-4 bg-blue-600 -translate-y-1/2" />
        
        {milestones.map((milestone, index) => (
          <div key={milestone.name} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                milestone.completed
                  ? 'bg-green-500 border-green-600'
                  : milestone.current
                  ? 'bg-white border-blue-600 ring-4 ring-blue-200'
                  : 'bg-white border-black'
              }`}
            >
              {milestone.completed && (
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="mt-2 text-sm font-medium text-center">{milestone.name}</span>
            {milestone.current && (
              <div className="absolute -bottom-12 flex flex-col items-center">
                <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <span className="text-xs font-medium whitespace-nowrap">You are here</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="h-12" />
    </div>
  )
}
