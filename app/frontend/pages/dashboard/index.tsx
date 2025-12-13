import { useState, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import Sidebar from '../../components/dashboard/Sidebar'
import FlipClock from '../../components/dashboard/FlipClock'
import ProgressMap from '../../components/dashboard/ProgressMap'
import TicketSection from '../../components/dashboard/TicketSection'

interface User {
  id: number
  email: string
  username: string | null
  slack_id: string | null
  account_linked: boolean
  hackatime_linked: boolean
  admin: boolean
}

interface Milestone {
  name: string
  key: string
  completed: boolean
  current: boolean
}

interface DashboardProps {
  user: User
  milestones: Milestone[]
  total_seconds: number
}

const DEPARTURE_DATE = new Date('2026-03-01T00:00:00')

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      const totalSeconds = Math.floor(diff / 1000)
      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      return { days, hours, minutes, seconds }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

export default function Dashboard({ user, milestones, total_seconds }: DashboardProps) {
  const displayName = user.username || user.email.split('@')[0]
  const countdown = useCountdown(DEPARTURE_DATE)
  
  const totalSecs = total_seconds || 0
  const loggedHours = Math.floor(totalSecs / 3600)
  const loggedMinutes = Math.floor((totalSecs % 3600) / 60)
  const loggedSeconds = totalSecs % 60

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Head title="Dashboard - Hack Club: The Game" />
      
      <Sidebar user={{ name: displayName, slackId: user.slack_id || '', admin: user.admin }} activeItem="home" />
      
      <main className="flex-1 p-8">
        <div className="flex gap-6 mb-8">
          <div className="flex-1">
            <FlipClock title="TIME UNTIL DEPARTURE" days={countdown.days} hours={countdown.hours} minutes={countdown.minutes} seconds={countdown.seconds} />
          </div>
          <div className="flex-1">
            <FlipClock title="TIME LOGGED" hours={loggedHours} minutes={loggedMinutes} seconds={loggedSeconds} />
          </div>
        </div>
        
        <ProgressMap milestones={milestones} />
        
        <TicketSection accountVerified={user.account_linked} hackatimeLinked={user.hackatime_linked} />
      </main>
    </div>
  )
}
