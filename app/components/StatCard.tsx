interface StatCardProps {
  title: string
  value: number
  icon: string
  color: string
}

const colorMap: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  blue:    { bg: "bg-blue-50",    text: "text-blue-600",    darkBg: "dark:bg-blue-900/20",    darkText: "dark:text-blue-400" },
  purple:  { bg: "bg-purple-50",  text: "text-purple-600",  darkBg: "dark:bg-purple-900/20",  darkText: "dark:text-purple-400" },
  zinc:    { bg: "bg-zinc-50",    text: "text-zinc-600",    darkBg: "dark:bg-zinc-900/20",    darkText: "dark:text-zinc-400" },
  green:   { bg: "bg-green-50",   text: "text-green-600",   darkBg: "dark:bg-green-900/20",   darkText: "dark:text-green-400" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", darkBg: "dark:bg-emerald-900/20", darkText: "dark:text-emerald-400" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   darkBg: "dark:bg-amber-900/20",   darkText: "dark:text-amber-400" },
  red:     { bg: "bg-red-50",     text: "text-red-600",     darkBg: "dark:bg-red-900/20",     darkText: "dark:text-red-400" },
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const c = colorMap[color] ?? colorMap.zinc

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
      <div className={`text-2xl h-12 w-12 flex items-center justify-center rounded-full ${c.bg} ${c.text} ${c.darkBg} ${c.darkText}`}>
        {icon}
      </div>
      <div>
        <div className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">{title}</div>
        <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</div>
      </div>
    </div>
  )
}
