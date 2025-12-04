export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8 tracking-[-0.05em]">
          <span className="font-normal">hack club: </span>
          <span className="font-bold">the game.</span>
        </h1>
        <p className="text-2xl mb-12 text-gray-700">
          Code online, then join us in a hide-and-seek competition across Manhattan.
        </p>
        <div className="space-y-4">
          <a
            href="/rsvp"
            className="inline-block bg-black text-white px-8 py-4 text-xl font-bold border-4 border-black hover:bg-white hover:text-black transition-colors"
          >
            Get Started →
          </a>
          <div className="text-gray-500">
            <p>Already have an account? <a href="/auth/start" className="underline hover:no-underline">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}