import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { NavLink } from "./NavLink"
import { MobileMenu } from "./MobileMenu"

export default async function Navbar() {
  const session = await auth()

  if (!session?.user) return null

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <MobileMenu userRole={session.user.role} userEmail={session.user.email} />
          <Link href="/todos" className="hidden md:block font-bold text-xl tracking-tight text-blue-600 dark:text-blue-400">
            TodoApp
          </Link>
          <div className="hidden md:flex gap-6">
            <NavLink href="/todos">Todos</NavLink>
            <NavLink href="/stream">Stream</NavLink>
            {session.user.role === "admin" && (
              <NavLink href="/user-management">User Management</NavLink>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 dark:text-zinc-400 hidden md:block">
              {session.user.email}
            </span>
            <div className="relative group cursor-help">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-zinc-900 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 transition-transform group-hover:scale-105">
                {session.user.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[10px] font-bold rounded shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 pointer-events-none uppercase tracking-widest z-[60] whitespace-nowrap">
                {session.user.role}
              </div>
            </div>
          </div>
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}>
            <button className="text-sm font-medium px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 transition-colors">
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}
