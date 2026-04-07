import TodoItem from "./TodoItem"

type Todo = {
  id: string
  title: string
  completed: boolean
}

export default function TodoList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return (
      <div className="p-8 text-center bg-white/50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
        <p className="text-zinc-500 dark:text-zinc-400">No todos found. Ready to add some?</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}
