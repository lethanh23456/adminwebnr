// app/admin/layout.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/games", label: "Quản lý Game", icon: "🎮" },
  { href: "/admin/users", label: "Người dùng", icon: "👥" },
  { href: "/admin/stats", label: "Thống kê", icon: "📈" },
  { href: "/admin/settings", label: "Cài đặt", icon: "⚙️" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#FFC000] shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between h-20 px-4">
          {/* Menu button cho mobile */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-white p-2 hover:bg-yellow-400 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎮</span>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-4">
            <button className="text-white hover:bg-yellow-400 p-2 rounded-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-red-600">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-64 bg-white shadow-xl
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            mt-20 lg:mt-0
          `}
        >
          <div className="h-full overflow-y-auto p-4">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    font-semibold transition-all duration-200
                    ${pathname === item.href
                      ? "bg-[#FFC000] text-red-600 shadow-md"
                      : "text-gray-700 hover:bg-yellow-50 hover:text-red-600"
                    }
                  `}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200"></div>

            {/* Additional links */}
            <div className="space-y-2">
              <Link
                href="/admin/help"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-yellow-50 hover:text-red-600 font-semibold transition"
              >
                <span className="text-2xl">❓</span>
                <span>Trợ giúp</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-yellow-50 hover:text-red-600 font-semibold transition"
              >
                <span className="text-2xl">🏠</span>
                <span>Về trang chủ</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Overlay cho mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}