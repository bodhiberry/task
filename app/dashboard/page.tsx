import { auth } from "@/auth";
import { getTasks, getActivities } from "@/app/actions/tasks";
import TaskCard from "@/components/TaskCard";
import CreateTaskModal from "@/components/CreateTaskModal";
import ActivityFeed from "@/components/ActivityFeed";
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  X,
  Zap
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const [tasks, activities] = await Promise.all([getTasks(), getActivities()]);

  const stats = [
    { label: "Total Tasks", value: tasks.length, icon: ArrowUpRight, color: "text-blue-400" },
    { label: "Completed", value: tasks.filter(t => t.status === "DONE").length, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Pending", value: tasks.filter(t => t.status === "TODO").length, icon: Clock, color: "text-amber-400" },
    { label: "High Priority", value: tasks.filter(t => t.priority === "HIGH").length, icon: AlertCircle, color: "text-rose-400" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {session?.user?.name?.split(" ")[0]}!</h1>
          <p className="text-zinc-500">Here&apos;s what&apos;s happening with your projects today.</p>
        </div>
        <div className="flex items-center gap-4">
          <CreateTaskModal />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-500">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              Recent Tasks
              <span className="text-xs font-medium bg-white/5 text-zinc-500 px-2 py-1 rounded-md">{tasks.length}</span>
            </h2>
          </div>

          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.slice(0, 4).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-dashed border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">No tasks yet</h3>
              <p className="text-zinc-500 mb-8">Start by adding a new task to your workspace.</p>
              <CreateTaskModal />
            </div>
          )}
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            Activity Feed
            <Zap className="w-4 h-4 text-blue-400" />
          </h2>
          <div className="glass-card rounded-[32px] p-8 border border-white/5 min-h-[400px]">
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
}
