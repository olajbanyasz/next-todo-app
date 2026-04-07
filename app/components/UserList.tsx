"use client"

import { useTransition } from "react"
import { deleteUser, restoreUser, promoteUser, demoteUser } from "@/app/actions/admin-actions"

type User = {
  id: string
  email: string
  name: string | null
  role: string
  deleted: boolean
  lastLoginAt: Date | null
  todoCount: number
}

export default function UserList({ users }: { users: User[] }) {
  const [isPending, startTransition] = useTransition()

  if (users.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <p className="text-zinc-500 dark:text-zinc-400">No users found.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Todos</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-zinc-200 dark:divide-zinc-800 ${isPending ? 'opacity-50' : ''}`}>
            {users.map((user) => (
              <tr key={user.id} className={`${user.deleted ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30'} transition-colors`}>
                <td className="px-4 py-3">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">{user.name || 'Unnamed'}</div>
                  <div className={`text-xs ${user.deleted ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    {user.email} {user.deleted && '(Deleted)'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                      : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{user.todoCount}</td>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-4 py-3 text-right">
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
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
