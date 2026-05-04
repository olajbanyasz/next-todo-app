"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function TodoFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFilter = searchParams.get("filter") || "all"

  const setFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (filter === "all") {
      params.delete("filter")
    } else {
      params.set("filter", filter)
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 mb-6">
      <FilterButton 
        label="All" 
        active={currentFilter === "all"} 
        onClick={() => setFilter("all")} 
      />
      <FilterButton 
        label="Active" 
        active={currentFilter === "active"} 
        onClick={() => setFilter("active")} 
      />
      <FilterButton 
        label="Completed" 
        active={currentFilter === "completed"} 
        onClick={() => setFilter("completed")} 
      />
    </div>
  )
}

interface FilterButtonProps {
  label: string
  active: boolean
  onClick: () => void
}

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active 
          ? "bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900" 
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800"
      }`}
    >
      {label}
    </button>
  )
}
