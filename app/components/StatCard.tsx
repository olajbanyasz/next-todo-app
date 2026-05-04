interface StatCardProps {
  title: string
  value: number
  icon: string
  color: string
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
      <div className={`text-2xl h-12 w-12 flex items-center justify-center rounded-full bg-${color}-50 text-${color}-600 dark:bg-${color}-900/20 dark:text-${color}-400`}>
        {icon}
      </div>
      <div>
        <div className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">{title}</div>
        <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</div>
      </div>
    </div>
  )
}
