"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { NavLink } from "./NavLink"

interface MobileMenuProps {
  userRole?: string
  userEmail?: string | null
}

export function MobileMenu({ userRole, userEmail }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 -ml-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 py-6 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200 z-[60] shadow-xl">
          <div onClick={() => setIsOpen(false)}>
            <NavLink href="/todos">Todos</NavLink>
          </div>
          <div onClick={() => setIsOpen(false)}>
            <NavLink href="/stream">Stream</NavLink>
          </div>
          {userRole === "admin" && (
            <div onClick={() => setIsOpen(false)}>
              <NavLink href="/user-management">User Management</NavLink>
            </div>
          )}

          {userEmail && (
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Logged in as:</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{userEmail}</p>
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5">{userRole}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
