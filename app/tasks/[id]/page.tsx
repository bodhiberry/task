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
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import SubtaskList from "@/components/SubtaskList";
import TaskAssignee from "@/components/TaskAssignee";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const [task, users] = await Promise.all([getTask(id), getUsers()]);
  if (!task) notFound();

  const isDone = task.status === "DONE";

  return (
    <div className="flex-1 overflow-y-auto bg-black text-white selection:bg-zinc-800">
      <div className="max-w-6xl mx-auto p-8 lg:p-12">
        <header className="mb-16 flex items-center justify-between border-b border-zinc-900 pb-6">
          <Link 
            href="/tasks"
            className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </Link>

          <div className="flex items-center gap-4">
            <button className="text-zinc-500 hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="text-zinc-500 hover:text-white transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-16">
            {/* Header section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest ${task.priority === 'HIGH' ? 'text-rose-500' : 'text-zinc-400'}`}>
                  {task.priority} Priority
                </span>
                <span className={`px-2 py-1 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest ${isDone ? 'text-emerald-500' : 'text-blue-500'}`}>
                  {task.status.replace("_", " ")}
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-zinc-100">
                {task.title}
              </h1>
              <p className="text-xl text-zinc-400 leading-relaxed max-w-3xl font-light">
                {task.description || "No description provided for this task."}
              </p>
            </div>

            {/* Progress Section */}
            <div className="space-y-6">
              <div className="flex items-end justify-between border-b border-zinc-900 pb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Progress</h3>
                <span className="text-3xl font-light text-white">{task.progress}%</span>
              </div>
              <div className="w-full h-1 bg-zinc-900 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${isDone ? "bg-white" : "bg-zinc-400"}`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="pt-8 border-t border-zinc-900">
              <SubtaskList taskId={task.id} subtasks={task.subtasks} />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-12">
            {/* Assignment Section */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-900 pb-4">Assignment</h3>
              <TaskAssignee taskId={task.id} currentAssignee={task.assignedTo} users={users} />
              
              <div className="flex items-center gap-4 pt-4">
                <div className="w-10 h-10 bg-zinc-900 flex items-center justify-center text-zinc-500">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Created By</p>
                  <p className="text-sm font-medium text-white">{task.user.name}</p>
                </div>
              </div>
            </div>

            {/* Metadata Section */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-900 pb-4">Details</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-900 text-zinc-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Due Date</p>
                    <p className="text-sm font-medium text-white">
                      {task.dueDate ? format(new Date(task.dueDate), "MMMM d, yyyy") : "No deadline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-900 text-zinc-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Created At</p>
                    <p className="text-sm font-medium text-white">
                      {format(new Date(task.createdAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
