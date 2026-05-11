import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import AddTodoForm from "@/app/components/AddTodoForm"
import TodoList from "@/app/components/TodoList"

export default async function TodosPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch todos for the current user that are not deleted
  const todos = await prisma.todo.findMany({
    where: {
      userId: session.user.id,
      deleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="min-h-screen transition-colors duration-300">
      <main className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            My Tasks
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
            Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{session.user.name || session.user.email}</span>!
          </p>
        </header>

        <section className="space-y-8">
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <AddTodoForm />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
                To-Do List
              </h2>
              <span className="text-xs font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg">
                {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
            <TodoList todos={todos} />
          </div>
        </section>
      </main>

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>
    </div>
  )
}
