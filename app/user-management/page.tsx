import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import UserList from "@/app/components/UserList"
import StatsCards from "@/app/components/StatsCards"
import UserFilter from "@/app/components/UserFilter"
import { getAdminStats, getAdminUsers } from "@/app/actions/admin-actions"

export const metadata = {
  title: "Admin Dashboard - TodoApp",
  description: "Manage users and roles",
}

interface PageProps {
  searchParams: Promise<{
    email?: string
    deleted?: string
  }>
}

export default async function AdminPage({ searchParams }: PageProps) {
  const session = await auth()

  if (!session?.user || session.user.role !== "admin") {
    redirect("/todos")
  }

  const { email, deleted } = await searchParams

  const stats = await getAdminStats()
  const formattedUsers = await getAdminUsers({ email, deleted })

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Admin Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage users, roles and system statistics.</p>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          User Management
          <span className="text-xs font-normal px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-full">
            {formattedUsers.length} users found
          </span>
        </h2>
        <UserFilter />
        <UserList users={formattedUsers} />
      </div>
    </main>
  )
}
