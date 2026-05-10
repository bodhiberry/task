"use client";

import { motion } from "framer-motion";
import { 
  Clock, 
  CheckCircle2, 
  Trash2,
  MoreVertical
} from "lucide-react";
import { updateTaskStatus, deleteTask } from "@/app/actions/tasks";
import { format } from "date-fns";

const priorityColors = {
  LOW: "text-emerald-400 bg-emerald-400/10",
  MEDIUM: "text-amber-400 bg-amber-400/10",
  HIGH: "text-rose-400 bg-rose-400/10",
};

interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  status: string;
  dueDate?: Date | string | null;
}

export default function TaskCard({ task }: { task: Task }) {
  const isDone = task.status === "DONE";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 group hover:border-white/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
            {task.priority}
          </span>
          <h3 className={`text-lg font-semibold ${isDone ? "text-zinc-500 line-through" : "text-white"}`}>
            {task.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => deleteTask(task.id)}
            className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="p-2 rounded-lg text-zinc-500 cursor-pointer hover:bg-white/5">
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>
      </div>

      <p className="text-sm text-zinc-400 mb-6 line-clamp-2">
        {task.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-zinc-500">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">
            {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No deadline"}
          </span>
        </div>

        <button
          onClick={() => updateTaskStatus(task.id, isDone ? "TODO" : "DONE")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isDone 
              ? "bg-emerald-400/10 text-emerald-400" 
              : "bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          {isDone ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5" />
              Mark Done
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
