"use client"

import { useActionState, useState } from "react"
import { createTodo } from "@/app/actions/todo-actions"

export default function AddTodoForm() {
  const [state, formAction, pending] = useActionState(createTodo, null)
  const [title, setTitle] = useState("")

  const isInvalid = title.trim().length < 3

  return (
    <form
      key={state?.timestamp}
      action={formAction}
      className="bg-white/10 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-md mb-6 transition-all duration-300"
    >
      <div className="flex gap-3">
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 bg-transparent border-b border-zinc-300 dark:border-zinc-700 outline-none px-2 py-2 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-blue-500 transition-colors"
          disabled={pending}
          required
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={pending || isInvalid}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Adding..." : "Add Todo"}
        </button>
      </div>
      {state?.errors?.title && (
        <p className="text-red-500 text-sm mt-2">{state.errors.title[0]}</p>
      )}
      {state?.message && !state.success && !state.errors && (
        <p className="text-red-500 text-sm mt-2">{state.message}</p>
      )}
    </form>
  )
}
