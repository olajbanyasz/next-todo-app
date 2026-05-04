export default function StatsCards({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="blue" />
      <StatCard title="Total Admins" value={stats.totalAdmins} icon="🛡️" color="purple" />
      <StatCard title="Total Todos" value={stats.totalTodos} icon="📝" color="zinc" />
      <StatCard title="Completed Todos" value={stats.totalCompletedTodos} icon="✅" color="green" />
      <StatCard title="Active Todos" value={stats.totalActiveTodos} icon="⏳" color="amber" />
      <StatCard title="Deleted Todos" value={stats.totalDeletedTodos} icon="🗑️" color="red" />
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: string, color: string }) {
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
