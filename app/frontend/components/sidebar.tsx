import { useState } from "react";
import { Link } from "@inertiajs/react";
import HackClubLogo from "./HackClubLogo";
// Adapted from https://preline.co/docs/sidebar.html

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navigation Toggle */}
      <div className="lg:hidden py-16 text-center">
        <button
          type="button"
          className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-gray-800 border border-gray-800 text-white text-sm font-medium rounded-lg shadow-2xs align-middle hover:bg-gray-950 focus:outline-hidden focus:bg-gray-900"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(true)}
        >
          Open
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          transition-all duration-300 transform
          h-full
          fixed top-0 start-0 bottom-0 z-60
          bg-white border-e border-gray-200`}
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Header */}
          <header className="p-4 flex flex-col gap-4">
            <Link
              className="flex items-center gap-2 font-semibold text-xl text-black focus:outline-hidden focus:opacity-80"
              href="/"
            >
              <HackClubLogo className="w-10 h-10" />
              HCTG
            </Link>
            <a href="/" className=" text-lg text-gray-600">
              Dashboard
            </a>
            <a href="/projects" className=" text-lg text-gray-600">
              Projects
            </a>
            <a href="/members" className=" text-lg text-gray-600">
              Shop
            </a>
          </header>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
