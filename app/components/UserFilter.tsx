"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function UserFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const deletedFilter = searchParams.get("deleted") || "active"
  const emailFilter = searchParams.get("email") || ""
  
  const [inputValue, setInputValue] = useState(emailFilter)

  // Keep local state in sync with URL if it changes externally
  useEffect(() => {
    setInputValue(emailFilter)
  }, [emailFilter])

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && (key !== "deleted" || value !== "active")) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`)
  }

  const handleClear = () => {
    setInputValue("")
    updateFilters("email", "")
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="flex-1">
        <label htmlFor="email" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Search by Email</label>
        <div className="relative">
          <input
            id="email"
            type="text"
            placeholder="user@example.com"
            value={inputValue}
            onChange={(e) => {
              const val = e.target.value
              setInputValue(val)
              // Apply debounce or only filter if length >= 3
              if (val.length === 0 || val.length >= 3) {
                updateFilters("email", val)
              }
            }}
            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 pr-9 text-sm outline-none focus:border-blue-500 text-zinc-800 dark:text-zinc-200 transition-all"
          />
          {inputValue && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
              title="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="status" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">User Status</label>
        <select
          id="status"
          value={deletedFilter}
          onChange={(e) => updateFilters("deleted", e.target.value)}
          className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-zinc-800 dark:text-zinc-200 cursor-pointer"
        >
          <option value="active">Active Only</option>
          <option value="deleted">Deleted Only</option>
          <option value="all">All Users</option>
        </select>
      </div>
    </div>
  )
}
