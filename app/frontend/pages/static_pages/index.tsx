import { useState, useRef, useEffect } from "react";
import { useForm, Head } from "@inertiajs/react";

export default function Landing() {
  const { data, setData, post, reset } = useForm({ email: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/signup", {
      onSuccess: (page) => {
        if (page.props.url) {
          window.location.href = page.props.url as string;
        }
      },
    });
  };

  const [showSuccess, setShowSuccess] = useState(false);

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
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex h-20 w-full flex-col gap-2 sm:flex-row lg:gap-3"
        >
          <div className="flex h-full border-4 border-black bg-white px-4 sm:flex-1 lg:px-6">
            <input
              required
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              placeholder="your@email.com"
              className="w-full border-none bg-transparent font-[Arial] text-lg tracking-[-0.04em] text-black placeholder-gray-400 outline-none focus:ring-0 lg:text-3xl"
            />
          </div>
          <button
            type="submit"
            className="border-4 border-black bg-black px-8 py-4 text-xl font-bold text-white transition-colors hover:bg-white hover:text-black"
          >
            Get Started →
          </button>
        </form>

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
  );
}
