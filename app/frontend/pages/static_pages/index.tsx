export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="mb-8 text-6xl font-bold tracking-[-0.05em]">
          <span className="font-normal">hack club: </span>
          <span className="font-bold">the game.</span>
        </h1>
        <p className="mb-12 text-2xl text-gray-700">
          Code online, then join us in a jetlag inspired adventure across
          Manhattan.
        </p>
        <div className="space-y-4">
          <a
            href="/rsvp"
            className="inline-block border-4 border-black bg-black px-8 py-4 text-xl font-bold text-white transition-colors hover:bg-white hover:text-black"
          >
            Get Started →
          </a>
          <div className="text-gray-500">
            <p>
              Already have an account?{" "}
              <a href="/auth/start" className="underline hover:no-underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
