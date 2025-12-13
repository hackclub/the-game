import { useState, FormEvent } from 'react'
import { router } from '@inertiajs/react'

export default function Landing() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    router.post('/auth/create_email', { email }, {
      onFinish: () => setIsSubmitting(false)
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8 tracking-[-0.05em]">
          <span className="font-normal">hack club: </span>
          <span className="font-bold">the game.</span>
        </h1>
        <p className="text-2xl mb-12 text-gray-700">
          Code online, then join us in a jetlag inspired adventure across Manhattan.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full max-w-md px-4 py-3 text-lg border-4 border-black focus:outline-none focus:ring-2 focus:ring-black"
          />
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-block bg-black text-white px-8 py-4 text-xl font-bold border-4 border-black hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Get Started →'}
            </button>
          </div>
          <div className="text-gray-500">
            <p>Or <a href="/auth/start" className="underline hover:no-underline">sign in with Hack Club account</a></p>
          </div>
        </form>
      </div>
    </div>
  )
}