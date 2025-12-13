import { Head } from '@inertiajs/react'

export default function Adult() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-8">
      <Head title="Age Restriction - Hack Club: The Game" />

      <div className="bg-white border-4 border-black p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Age Restriction</h1>
        <p className="text-gray-600">
          Hack Club: The Game is for teenagers 18 and under. Thanks for your interest, but this program isn't available for your age group.
        </p>
      </div>
    </div>
  )
}
