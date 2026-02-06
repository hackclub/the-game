import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import HackClubLogo from "./rsvp/HackClubLogo";

interface PageProps {
  [key: string]: unknown;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { url, props, flash } = usePage<PageProps>();

  const navItems = [
    { href: "/home", label: "Home", icon: HomeIcon, color: "red-500" },
    {
      href: "/projects",
      label: "Projects",
      icon: ProjectsIcon,
      color: "blue-600",
    },
    {
      href: "/shop",
      label: "Shop",
      icon: ShopIcon,
      color: "green-600",
    },

    // {
    //   href: "/explore",
    //   label: "Explore",
    //   icon: ExploreIcon,
    //   color: "bg-purple-500",
    // },
  ];

  if (props.user.role === "admin") {
    navItems.push({
      href: "/admin",
      label: "Admin",
      icon: AdminIcon,
      color: "gray-500",
    });
  }

  const isActive = (href: string) => url.startsWith(href);
  const activeColor = navItems.find((i) => isActive(i.href))?.color;

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
        className={`w-64 ${activeColor ? "border-r-6" : ""} lg:end-auto border-${activeColor} lg:bottom-0 lg:block lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} fixed start-0 top-0 bottom-0 z-60 h-full transform bg-black transition-all duration-300`}
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
                <div className="text-xl leading-tight">hack club:</div>
                <div className="text-xl leading-tight font-bold">the game</div>
              </div>
            </Link>
          </header>

          {/* Navigation */}
          <nav className="flex-1 space-y-6 pl-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`my-3 flex items-center gap-4 rounded-lg rounded-l-full pr-2 transition-colors ${`${isActive(item.href) ? "" : "hover:"}bg-${item.color}`} `}
              >
                <div
                  className={`h-12 w-12 bg-${item.color} flex items-center justify-center rounded-full border border-black`}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-semibold text-white">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {Object.entries(flash ?? {}).map(([key, message]) => (
            <div
              x-key={key}
              className={`${key === "alert" ? "bg-red-500" : "bg-green-700"} m-4 rounded-md border-2 border-${key === "alert" ? "red-700" : "green-900"} p-4`}
            >
              <p className="text-white">{message as string}</p>
            </div>
          ))}

          {/* User Section */}
          <div className="mt-auto border-t border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-700">
                {props.user.avatar ? (
                  <img
                    src={props.user.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                    {props.user?.username?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-white">
                  {props.user?.username || "Guest"}
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
                    className="cursor-pointer text-gray-400 hover:text-white"
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

// @ts-expect-error future use
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
      fill-rule="evenodd"
      clip-rule="evenodd"
      stroke-linejoin="round"
      stroke-miterlimit="1.414"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="admin"
      viewBox="0 0 32 32"
      preserveAspectRatio="xMidYMid meet"
      fill="currentColor"
      width="48"
      height="48"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M21.437 17.023a1 1 0 0 1 .785.977v2.2H23a1 1 0 0 1 .907 1.42l-2.222 4.8a1 1 0 0 1-1.907-.42v-2.2H19a1 1 0 0 1-.907-1.42l2.222-4.8a1 1 0 0 1 1.122-.557zM19.834 16.977C20.714 16.173 21 14.873 21 13a5 5 0 0 0-10 0c0 1.873.286 3.173 1.165 3.977a8.029 8.029 0 0 0-3.6 4.062c-.162.408-.213.939.162 1.168.792.485 1.632-.457 2.105-1.257a5.997 5.997 0 0 1 5.48-2.942c1.132.058 2.373-.055 3.24-.784a8.75 8.75 0 0 0 .282-.247zM19 13c0 1.683-.271 2.241-.47 2.456-.162.176-.68.544-2.53.544-1.85 0-2.368-.368-2.53-.544C13.27 15.24 13 14.683 13 13a3 3 0 1 1 6 0z"
      ></path>
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
