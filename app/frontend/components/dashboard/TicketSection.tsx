interface TicketSectionProps {
  accountVerified: boolean
  hackatimeLinked: boolean
}

function TicketMachine() {
  return (
    <div className="bg-blue-700 p-4 flex flex-col items-center relative h-64 w-44">
      <div className="bg-gray-300 border-2 border-gray-400 w-24 h-24 mb-4" />
      
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-blue-800 flex items-center justify-center">
        <span className="text-yellow-400 font-bold text-lg tracking-widest" style={{ writingMode: 'vertical-rl' }}>
          TICKETS
        </span>
      </div>
      
      <div className="mt-auto w-full">
        <div className="border-2 border-red-600 bg-transparent p-1">
          <div className="bg-red-600 text-white text-xs font-bold text-center py-1">
            TICKET/RECEIPT
          </div>
          <div className="h-4 bg-red-600/30 flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 border-r border-red-600 last:border-r-0" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TrainTicket({ accountVerified, hackatimeLinked }: TicketSectionProps) {
  return (
    <div className="bg-white border-2 border-gray-300 w-72">
      <div className="flex border-b-2 border-yellow-400">
        <div className="bg-yellow-400 px-4 py-2 font-bold text-sm">PASS</div>
        <div className="bg-yellow-100 flex-1 px-4 py-2 font-bold text-sm">TRAIN TICKET</div>
      </div>
      
      <div className="p-4 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`w-5 h-5 border-2 border-gray-400 flex items-center justify-center ${accountVerified ? 'bg-green-500 border-green-500' : ''}`}>
            {accountVerified && (
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12l5 5L19 7" />
              </svg>
            )}
          </div>
          <span className="text-sm">Account verified</span>
        </label>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`w-5 h-5 border-2 border-gray-400 flex items-center justify-center ${hackatimeLinked ? 'bg-green-500 border-green-500' : ''}`}>
            {hackatimeLinked && (
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12l5 5L19 7" />
              </svg>
            )}
          </div>
          <span className="text-sm">Hackatime linked</span>
        </label>
      </div>
      
      <div className="border-t-2 border-dashed border-yellow-400 mx-2 mb-2" />
    </div>
  )
}

export default function TicketSection({ accountVerified, hackatimeLinked }: TicketSectionProps) {
  return (
    <div className="flex items-end gap-8 justify-center mt-8">
      <TicketMachine />
      <TrainTicket accountVerified={accountVerified} hackatimeLinked={hackatimeLinked} />
    </div>
  )
}
