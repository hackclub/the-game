import { Link } from '@inertiajs/react'
import HackClubLogo from '../HackClubLogo'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  color: string
  active?: boolean
}

interface SidebarProps {
  user: {
    name: string
    slackId: string
    admin?: boolean
  }
  activeItem?: string
}

function AdminIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
    </svg>
  )
}

function ProjectsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
    </svg>
  )
}

function ShopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.15 14.5l.85-1.5h7.5c.75 0 1.4-.4 1.75-1l3.6-6.5L19.25 5H6.2l-.9-2H1v2h2l3.6 7.6-1.35 2.45c-.15.3-.25.65-.25 1 0 1.1.9 2 2 2h12v-2H7.4c-.1 0-.25-.1-.25-.25z" />
    </svg>
  )
}

export default function Sidebar({ user, activeItem = 'home' }: SidebarProps) {
  const navItems: NavItem[] = [
    { name: 'Home', href: '/dashboard', icon: <HomeIcon />, color: 'bg-red-500', active: activeItem === 'home' },
    { name: 'Projects', href: '/projects', icon: <ProjectsIcon />, color: 'bg-blue-500', active: activeItem === 'projects' },
    { name: 'Shop', href: '/shop', icon: <ShopIcon />, color: 'bg-green-500', active: activeItem === 'shop' },
  ]

  const avatarUrl = `https://cachet.dunkirk.sh/users/${user.slackId}/r`

  return (
    <div className="w-72 bg-black min-h-screen flex flex-col border-r-4 border-red-600">
      <div className="p-6 flex items-center gap-4">
        <div className="w-12 h-12 text-red-500">
          <HackClubLogo className="w-full h-full" />
        </div>
        <div className="text-white">
          <div className="text-xl font-bold leading-tight">Hack Club:</div>
          <div className="text-xl font-bold leading-tight">The Game</div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
              item.active ? 'text-red-500' : 'text-white hover:text-gray-300'
            }`}
          >
            <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center text-white`}>
              {item.icon}
            </div>
            <span className="text-xl font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {user.admin && (
        <div className="px-4 pb-2">
          <Link
            href="/admin/users"
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
              activeItem === 'admin' ? 'text-orange-500' : 'text-white hover:text-gray-300'
            }`}
          >
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
              <AdminIcon />
            </div>
            <span className="text-xl font-medium">Admin</span>
          </Link>
        </div>
      )}

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{user.name}</span>
              {user.admin && (
                <span className="text-xs font-bold text-orange-500 bg-orange-500/20 px-1.5 py-0.5 rounded">
                  admin
                </span>
              )}
            </div>
            <div className="text-gray-400 text-sm">
              <Link href="/settings" className="hover:text-white">Settings</Link>
              <span className="mx-1">|</span>
              <Link href="/auth/logout" method="post" as="button" className="hover:text-white">Logout</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
