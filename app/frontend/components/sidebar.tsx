import { useState, useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import ticketIcon from "@/assets/figma/ticket.svg";
import homeIcon from "@/assets/figma/home.svg";
import hammerIcon from "@/assets/figma/hammer.svg";
import compassIcon from "@/assets/figma/compass.svg";
import adminIcon from "@/assets/figma/admin.svg";
import shopIcon from "@/assets/figma/shop.svg";

import clsx from "clsx";

interface PageProps {
  [key: string]: unknown;
}

function SidebarLink({
  name,
  link,
  icon,
}: {
  name: string;
  link: string;
  icon: string;
}) {
  const { url } = usePage<PageProps>();

  const active = url.startsWith(link);

  return (
    <Link
      key={link}
      href={link}
      className="group group relative z-10 flex items-center"
    >
      <div
        className={clsx(
          "flex items-center transition-all",
          active ? "pr-4" : "gap-[29px] px-3",
        )}
      >
        <div
          className={clsx(
            "transition-all",
            active &&
              "relative z-20 flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-[#fecb0d]",
            !active && "contents",
          )}
        >
          <div
            className={clsx(
              "transition-all",
              "flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white",
              !active && "shrink-0 group-hover:bg-[#fecb0d]",
            )}
          >
            <img src={icon} alt="" className="h-7 w-7" />
          </div>
        </div>

        <div
          className={clsx(
            "relative z-10 -ml-4 rounded-r-2xl py-2 pr-10 transition-all",
            active && "bg-[#fecb0d] pl-8",
            !active && "pl-4",
          )}
        >
          <span
            className={clsx(
              "transition-all",
              "text-4xl font-bold tracking-[-0.02em] transition-transform hover:scale-105",
              active && "smoothing-black mb-2 text-black",
              !active &&
                "smoothing-white text-white group-hover:text-[#fecb0d]",
            )}
          >
            {name}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { props, flash } = usePage<PageProps>();

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed top-4 right-8 z-70 lg:hidden">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center gap-x-2 rounded-sm bg-black px-6 py-6 text-lg font-medium text-white shadow-lg transition-colors hover:bg-white hover:text-black"
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="h-6 w-6"
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
        className={clsx(
          "fixed start-0 top-0 bottom-0 z-60 h-screen w-full transform transition-all duration-300",
          "lg:relative lg:end-auto lg:bottom-0 lg:block lg:w-96 lg:translate-x-0",
          "bg-[#0f0f0f]",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ clipPath: "polygon(0% 0%, 0% 100%, 90% 100%, 100% 0%)" }}
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex h-full max-h-full flex-col overflow-hidden px-6 py-8 pr-12 text-white">
          {/* Nav Section */}
          <nav className="relative z-10 mt-6 flex flex-col gap-[40px]">
            {/* Connecting Bar */}
            <div className="pointer-events-none absolute top-2 left-[30px] z-0 h-[90%] w-[15px] rounded-full bg-white" />

            <SidebarLink link="/home" name="Home" icon={homeIcon} />
            <SidebarLink link="/projects" name="Projects" icon={hammerIcon} />
            <SidebarLink link="/explore" name="Gallery" icon={compassIcon} />
            <SidebarLink link="/shop" name="Shop" icon={shopIcon} />
            {props.user.role === "admin" && (
              <SidebarLink link="/admin" name="Admin" icon={adminIcon} />
            )}
          </nav>

          {/* Flash Messages */}
          {Object.entries(flash ?? {}).map(([key, message]) => (
            <div
              key={key}
              className={`${key === "alert" ? "bg-red-500 text-white" : "bg-[#fecb0d] text-black"} animate-scale-up relative z-10 mt-6 rounded-xl p-4`}
            >
              <h1 className="smoothing-black text-2xl font-bold">
                {key === "alert" ? "Oops..." : "Nice!"}
              </h1>
              <p className="smoothing-black">{message as string}</p>
            </div>
          ))}

          {/* Bottom Section - Help & User Info */}
          <div className="relative z-10 mt-auto mr-16 flex flex-col gap-4 lg:mr-0">
            {/* Help Box */}
            <div className="rounded-xl border-2 border-white p-4">
              <p className="smoothing-white text-center text-white">
                Ask in{" "}
                <a
                  className="underline"
                  target="_blank"
                  href="https://hackclub.enterprise.slack.com/archives/C0A9XULS1SL"
                >
                  #hctg-help
                </a>{" "}
                or email{" "}
                <a className="underline" href="mailto:hctg@hackclub.com">
                  hctg@hackclub.com
                </a>{" "}
                if you need help!
              </p>
            </div>

            {/* User Info Card */}
            <div className="rounded-2xl bg-[#fecb0d] p-[21px] text-black">
              <div className="flex items-center gap-3">
                <div className="h-[45px] w-[45px] shrink-0 overflow-hidden rounded-full bg-white">
                  {props.user.avatar ? (
                    <img
                      src={props.user.avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-black">
                      {props.user?.username?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="smoothing-black truncate text-[26px] leading-tight font-bold tracking-[-0.04em]">
                    {props.user?.username || "Guest"}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <img src={ticketIcon} alt="" className="h-4 w-4" />
                      <span className="smoothing-black text-xl tracking-[-0.06em]">
                        {props.user.balance}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/auth/logout"
                        method="post"
                        as="button"
                        className="cursor-pointer text-black/70 transition-transform hover:scale-110"
                        title="Logout"
                      >
                        <img src="/icons/logout.svg" className="h-5 w-5" />
                      </Link>

                      <Link
                        href="/settings"
                        className="text-black/70 transition-transform hover:scale-110"
                        title="Settings"
                      >
                        <img src="/icons/settings.svg" className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
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
