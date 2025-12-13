import { Head } from '@inertiajs/react'

export default function Sorry() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-8">
      <Head title="Sorry - Hack Club: The Game" />

      <div className="bg-white border-4 border-black p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Sorry</h1>
        <p className="text-gray-600">
          Your account has been restricted. If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  )
}
