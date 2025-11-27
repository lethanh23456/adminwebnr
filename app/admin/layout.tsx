"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const allSidebarItems = [
  { href: "/admin", label: "Quản lý rút tiền", icon: "💰", roles: ["ADMIN", "CASHIER"] },
  { href: "/admin/post", label: "Quản lý tin tức", icon: "📰", roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/acc", label: "Quản lý tài khoản", icon: "👤", roles: ["ADMIN", "PARTNER"] },
  { href: "/admin/stats", label: "Thống kê", icon: "📊", roles: ["ADMIN", "FINANCE"] },
  { href: "/admin/PlayerManagementAdmin", label: "Quản lý người chơi (Admin)", icon: "👑", roles: ["ADMIN"] },
  { href: "/admin/PlayerManagement", label: "Quản lý người chơi", icon: "👥", roles: ["ADMIN", "PLAYER MANAGER"] },
  { href: "/", label: "Đăng xuất", icon: "🚪", roles: ["ADMIN", "PARTNER", "PLAYER MANAGER", "CASHIER", "FINANCE", "EDITOR"] },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState<string>("")
  const [sidebarItems, setSidebarItems] = useState(allSidebarItems)

  useEffect(() => {
    const store = localStorage.getItem("currentUser")
    const user = store ? JSON.parse(store) : null
    const role = user?.role || ""
    
    setUserRole(role)
    
    // Filter sidebar items based on user role
    if (role) {
      const filteredItems = allSidebarItems.filter(item => 
        item.roles.includes(role)
      )
      setSidebarItems(filteredItems)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#4C4C4C] shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between h-20 px-4">
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

          <div className="flex items-center gap-3">
            <span className="text-2xl">🎮</span>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-blue-600 rounded-lg">
              <span className="text-sm font-semibold text-white">
                {userRole || "Guest"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
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
                    group
                    flex items-center gap-3 px-4 py-3
                    font-medium text-sm
                    rounded-lg
                    transition-all duration-200
                    border-2
                    ${pathname === item.href
                      ? "bg-white border-blue-500 text-blue-600 shadow-sm"
                      : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm"
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <main className="flex-1 p-6 lg:p-8 bg-[#F0F2F5]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}