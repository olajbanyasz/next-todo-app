import StatCard from "./StatCard"

interface Stats {
  totalUsers: number
  totalAdmins: number
  onlineUsers: number
  totalTodos: number
  totalCompletedTodos: number
  totalActiveTodos: number
  totalDeletedTodos: number
}

interface StatsCardsProps {
  stats: Stats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="blue" />
      <StatCard title="Online Users" value={stats.onlineUsers} icon="🟢" color="emerald" />
      <StatCard title="Total Admins" value={stats.totalAdmins} icon="🛡️" color="purple" />
      <StatCard title="Total Todos" value={stats.totalTodos} icon="📝" color="zinc" />
      <StatCard title="Completed Todos" value={stats.totalCompletedTodos} icon="✅" color="green" />
      <StatCard title="Active Todos" value={stats.totalActiveTodos} icon="⏳" color="amber" />
      <StatCard title="Deleted Todos" value={stats.totalDeletedTodos} icon="🗑️" color="red" />
    </div>
  )
}
