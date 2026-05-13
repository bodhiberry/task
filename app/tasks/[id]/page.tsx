import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getTask, getUsers } from "@/app/actions/tasks";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User as UserIcon,
  MessageSquare,
  Share2,
  MoreHorizontal,
  ChevronRight,
  Target
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import SubtaskList from "@/components/SubtaskList";
import TaskAssignee from "@/components/TaskAssignee";
import TaskAttachments from "@/components/TaskAttachments";
import TaskStatusToggle from "@/components/TaskStatusToggle";
import { motion } from "framer-motion";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const [task, users] = await Promise.all([getTask(id), getUsers()]);
  if (!task) notFound();

  const isDone = task.status === "DONE";

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto p-6 lg:p-12 space-y-12">
        {/* Navigation & Actions */}
        <header className="flex items-center justify-between">
          <Link 
            href="/tasks"
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">All Tasks</span>
          </Link>

          <div className="flex items-center gap-3">
            <TaskStatusToggle taskId={task.id} currentStatus={task.status} />
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="glass-card rounded-[32px] p-8 lg:p-12 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] ${
                    task.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400' : 
                    task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400' : 
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {task.priority} Priority
                  </span>
                  <ChevronRight className="w-3 h-3 text-zinc-700" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    ID: {task.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight gradient-text">
                  {task.title}
                </h1>
                
                <p className="text-lg text-zinc-400 leading-relaxed font-light">
                  {task.description || "No description provided for this task."}
                </p>
              </div>

              {/* Progress Section */}
              <div className="space-y-4 pt-4">
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Target className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Current Progress</span>
                  </div>
                  <span className="text-2xl font-light text-white">{task.progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(59,130,246,0.3)] ${isDone ? "bg-emerald-500" : "bg-blue-500"}`}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="glass-card rounded-[32px] p-8">
              <SubtaskList taskId={task.id} subtasks={task.subtasks} />
            </div>

            {/* Attachments Section */}
            <div className="glass-card rounded-[32px] p-8">
              <TaskAttachments taskId={task.id} attachments={task.attachments} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Assignment Section */}
            <div className="glass-card rounded-[32px] p-8 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Assignment</h3>
              <TaskAssignee taskId={task.id} currentAssignee={task.assignedTo} users={users} />
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 ring-1 ring-white/10">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-0.5">Created By</p>
                  <p className="text-sm font-bold text-white">{task.user.name}</p>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="glass-card rounded-[32px] p-8 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 ring-1 ring-blue-500/20">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-0.5">Due Date</p>
                    <p className="text-sm font-bold text-white">
                      {task.dueDate ? format(new Date(task.dueDate), "MMMM d, yyyy") : "No deadline"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 ring-1 ring-white/10">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-0.5">Created At</p>
                    <p className="text-sm font-bold text-white">
                      {format(new Date(task.createdAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-8 rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-4 shadow-xl shadow-blue-500/20">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Quick Actions</h3>
              <p className="text-sm text-white/80 font-light leading-relaxed">
                Need to discuss this task? Share it with your team or add a comment.
              </p>
              <button className="w-full py-3 rounded-xl bg-white text-blue-600 text-xs font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all active:scale-[0.98]">
                Open Discussion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
