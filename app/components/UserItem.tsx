"use client"

import { useTransition } from "react"
import { deleteUser, restoreUser, promoteUser, demoteUser } from "@/app/actions/admin-actions"

export type User = {
  id: string
  email: string | null
  name: string | null
  role: string
  deleted: boolean
  lastLoginAt: Date | null
  todoCount: number
}

export default function UserItem({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition()

  return (
    <tr className={`${user.deleted ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30'} transition-colors ${isPending ? 'opacity-50' : ''}`}>
      <td className="px-4 py-3">
        <div className="font-medium text-zinc-900 dark:text-zinc-100">{user.name || 'Unnamed'}</div>
        <div className={`text-xs ${user.deleted ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
          {user.email} {user.deleted && '(Deleted)'}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.role === 'admin' 
            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
        }`}>
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3 text-center text-zinc-600 dark:text-zinc-400">{user.todoCount}</td>
      <td className="px-4 py-3 text-center text-zinc-500 dark:text-zinc-400">
        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
      </td>
      <td className="px-4 py-3 text-right min-w-[200px]">
        <div className="flex justify-end gap-2">
          {user.role === 'user' && !user.deleted && (
            <button 
              onClick={() => startTransition(() => { promoteUser(user.id) })}
              disabled={isPending}
              className="text-xs px-2 py-1 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded hover:bg-purple-100 transition-colors"
            >
              Promote to Admin
            </button>
          )}
          {user.role === 'admin' && !user.deleted && (
            <button 
              onClick={() => startTransition(() => { demoteUser(user.id) })}
              disabled={isPending}
              className="text-xs px-2 py-1 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 rounded hover:bg-zinc-200 transition-colors"
            >
              Demote to User
            </button>
          )}
          {user.deleted ? (
            <button 
              onClick={() => startTransition(() => { restoreUser(user.id) })}
              disabled={isPending}
              className="text-xs px-2 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded hover:bg-green-100 transition-colors"
            >
              Restore
            </button>
          ) : (
            user.role === 'user' && (
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this user?")) {
                    startTransition(() => { deleteUser(user.id) })
                  }
                }}
                disabled={isPending}
                className="text-xs px-2 py-1 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            )
          )}
        </div>
      </td>
    </tr>
  )
}
