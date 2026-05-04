import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { NavLink } from "./NavLink"

export default async function Navbar() {
  const session = await auth()
  
  if (!session?.user) return null

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/todos" className="font-bold text-xl tracking-tight text-blue-600 dark:text-blue-400">
            TodoApp
          </Link>
          <div className="hidden sm:flex gap-6">
            <NavLink href="/todos">Todos</NavLink>
            {session.user.role === "admin" && (
              <NavLink href="/admin">Admin</NavLink>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500 dark:text-zinc-400 hidden sm:block">
            {session.user.email} <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 ml-2">{session.user.role}</span>
          </span>
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
