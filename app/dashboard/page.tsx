import { auth } from "@/auth";
import { getTasks } from "@/app/actions/tasks";
import TaskCard from "@/components/TaskCard";
import CreateTaskModal from "@/components/CreateTaskModal";
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  X
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const tasks = await getTasks();

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
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              placeholder="Search tasks..." 
              className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-64"
            />
          </div>
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

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          Your Tasks
          <span className="text-xs font-medium bg-white/5 text-zinc-500 px-2 py-1 rounded-md">{tasks.length}</span>
        </h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>
      </div>

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-dashed border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
          <p className="text-zinc-500 max-w-xs mx-auto mb-8">
            You haven&apos;t created any tasks yet. Start by adding a new one to keep track of your work.
          </p>
          <CreateTaskModal />
        </div>
      )}
    </div>
  );
}
