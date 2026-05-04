import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import UserList from "@/app/components/UserList"
import StatsCards from "@/app/components/StatsCards"
import UserFilter from "@/app/components/UserFilter"

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

  // Stats fetching
  const [
    totalUsers,
    totalAdmins,
    totalTodos,
    totalCompletedTodos,
    totalActiveTodos,
    totalDeletedTodos
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "admin" } }),
    prisma.todo.count(),
    prisma.todo.count({ where: { completed: true } }),
    prisma.todo.count({ where: { completed: false, deleted: false } }),
    prisma.todo.count({ where: { deleted: true } })
  ])

  const stats = {
    totalUsers,
    totalAdmins,
    totalTodos,
    totalCompletedTodos,
    totalActiveTodos,
    totalDeletedTodos
  }

  // Users fetching with filters
  const where: any = {}
  if (email && email.length >= 3) {
    where.email = { contains: email, mode: 'insensitive' }
  }
  
  if (deleted === 'deleted') {
    where.deleted = true
  } else if (deleted === 'all') {
    // No deleted filter
  } else {
    // Default: active only
    where.deleted = false
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      deleted: true,
      lastLoginAt: true,
      _count: {
        select: { todos: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const formattedUsers = users.map(u => ({
    ...u,
    todoCount: u._count.todos
  }))

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
