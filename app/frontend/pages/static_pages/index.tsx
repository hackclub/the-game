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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8 tracking-[-0.05em]">
          <span className="font-normal">hack club: </span>
          <span className="font-bold">the game.</span>
        </h1>
        <p className="text-2xl mb-12 text-gray-700">
          Code online, then join us in a jetlag inspired adventure across
          Manhattan.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full mt-4 h-20"
        >
          <div className="bg-white border-4 border-black px-4 lg:px-6 sm:flex-1 h-full flex">
            <input
              required
              type="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              placeholder="your@email.com"
              className="w-full text-lg lg:text-3xl tracking-[-0.04em] text-black bg-transparent border-none outline-none placeholder-gray-400 focus:ring-0 font-[Arial]"
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white px-8 py-4 text-xl font-bold border-4 border-black hover:bg-white hover:text-black transition-colors"
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
