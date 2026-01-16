import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import HackClubLogo from "./rsvp/HackClubLogo";

interface User {
  id: number;
  slack_id: string;
  username: string;
  avatar: string | null;
  admin: boolean;
}

interface PageProps {
  current_user?: User;
  [key: string]: unknown;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { url, props } = usePage<PageProps>();
  const user = props.current_user;
  const avatarUrl = user?.avatar;

  const isAdmin = user?.admin || false;

  const navItems = [
    { href: "/home", label: "Home", icon: HomeIcon, color: "bg-red-500" },
    {
      href: "/projects",
      label: "Projects",
      icon: ProjectsIcon,
      color: "bg-blue-600",
    },

    // {
    //   href: "/explore",
    //   label: "Explore",
    //   icon: ExploreIcon,
    //   color: "bg-purple-500",
    // },
  ];

  const isActive = (href: string) => url.startsWith(href);
  console.log(isAdmin);

  return (
    <>
      {/* Navigation Toggle */}
      <div className="fixed top-4 left-4 z-70 lg:hidden">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-medium text-white shadow-lg hover:bg-gray-700"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(true)}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`w-64 lg:end-auto lg:bottom-0 lg:block lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} fixed start-0 top-0 bottom-0 z-60 h-full transform bg-black transition-all duration-300`}
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex h-full max-h-full flex-col">
          {/* Header with Logo */}
          <header className="p-6">
            <Link
              className="flex items-center gap-3 focus:outline-none"
              href="/"
            >
              <div className="flex h-12 w-12 items-center justify-center">
                <HackClubLogo className="h-12 w-12 text-white" />
              </div>
              <div className="text-white">
                <div className="text-xl leading-tight font-bold">
                  Hack Club:
                </div>
                <div className="text-xl leading-tight font-bold">The Game</div>
              </div>
            </Link>
          </header>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-lg px-2 py-3 transition-colors ${
                  isActive(item.href) ? "bg-red-600" : "hover:bg-gray-900"
                } `}
              >
                <div
                  className={`h-12 w-12 ${item.color} flex items-center justify-center rounded-full`}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-semibold text-white">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="mt-auto border-t border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-700">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                    {user?.username?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-white">
                  {user?.username || "Guest"}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Link
                    href="/settings"
                    className="text-gray-400 hover:text-white"
                  >
                    Settings
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link
                    href="/auth/logout"
                    method="post"
                    as="button"
                    className="text-gray-400 hover:text-white"
                  >
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function ExploreIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
      />
    </svg>
  );
}

function ProjectsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );
}

function AdminIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );
}

function ShopIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}
