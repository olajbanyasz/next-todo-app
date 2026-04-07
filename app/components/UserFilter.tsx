"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function UserFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const deletedFilter = searchParams.get("deleted") || "active"
  const emailFilter = searchParams.get("email") || ""

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "active") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="flex-1">
        <label htmlFor="email" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Search by Email</label>
        <input
          id="email"
          type="text"
          placeholder="user@example.com"
          defaultValue={emailFilter}
          onChange={(e) => {
            // Apply debounce or only filter if length >= 3
            if (e.target.value.length === 0 || e.target.value.length >= 3) {
              updateFilters("email", e.target.value)
            }
          }}
          className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-zinc-800 dark:text-zinc-200"
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">User Status</label>
        <select
          id="status"
          value={deletedFilter}
          onChange={(e) => updateFilters("deleted", e.target.value)}
          className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-zinc-800 dark:text-zinc-200"
        >
          <option value="active">Active Only</option>
          <option value="deleted">Deleted Only</option>
          <option value="all">All Users</option>
        </select>
      </div>
    </div>
  )
}
