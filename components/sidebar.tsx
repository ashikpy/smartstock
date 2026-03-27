'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Bell, 
  Scan, 
  BarChart3, 
  Settings,
  Menu,
  X,
  PlusCircle,
  Warehouse
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Scan Simulation', href: '/scan', icon: Scan },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 rounded-lg bg-zinc-900 p-2 text-zinc-400 hover:text-white lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform bg-zinc-950 border-r border-zinc-800 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 font-sans",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center gap-2 px-2 pb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50">
              <Warehouse className="h-5 w-5 text-zinc-950" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SmartStock</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-zinc-800">
            <Link
              href="/inventory/new"
              className="flex items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Add New Item
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
