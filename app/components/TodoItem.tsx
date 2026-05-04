"use client"

import { useState, useTransition } from "react"
import { toggleTodo, deleteTodo, updateTodoTitle } from "@/app/actions/todo-actions"

interface Todo {
  id: string
  title: string
  completed: boolean
}

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(() => {
      toggleTodo(todo.id)
    })
  }

  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete this todo?")
    if (confirmed) {
      startTransition(() => {
        deleteTodo(todo.id)
      })
    }
  }

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle.trim() !== todo.title) {
      startTransition(() => {
        updateTodoTitle(todo.id, editTitle.trim())
      })
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditTitle(todo.title)
    setIsEditing(false)
  }

  return (
    <div className={`flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${isPending ? 'opacity-50' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isEditing || isPending}
        className="w-5 h-5 cursor-pointer accent-blue-600 rounded border-zinc-300 dark:border-zinc-700"
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveEdit()
            if (e.key === "Escape") handleCancelEdit()
          }}
          className="flex-1 bg-transparent border-b border-blue-500 outline-none px-1 text-zinc-800 dark:text-zinc-100"
          autoFocus
        />
      ) : (
        <span 
          className={`flex-1 cursor-pointer transition-all ${todo.completed ? 'line-through text-zinc-400 dark:text-zinc-600' : 'text-zinc-700 dark:text-zinc-200'}`}
          onClick={() => !isPending && setIsEditing(true)}
        >
          {todo.title}
        </span>
      )}

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
        {isEditing ? (
          <>
            <button onClick={handleSaveEdit} disabled={isPending} className="text-sm px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">Save</button>
            <button onClick={handleCancelEdit} disabled={isPending} className="text-sm px-3 py-1 bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} disabled={isPending} className="text-sm px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">Edit</button>
            <button onClick={handleDelete} disabled={isPending} className="text-sm px-3 py-1 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">Delete</button>
          </>
        )}
      </div>
    </div>
  )
}
