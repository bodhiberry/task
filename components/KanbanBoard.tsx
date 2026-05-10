"use client";

import { useState } from "react";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  status: string;
  dueDate?: Date | string | null;
  progress: number;
  assignedTo?: { name: string | null; image: string | null } | null;
}

const columns = [
  { id: "TODO", label: "To Do", color: "bg-zinc-500/10 text-zinc-400" },
  { id: "IN_PROGRESS", label: "In Progress", color: "bg-blue-500/10 text-blue-400" },
  { id: "DONE", label: "Done", color: "bg-emerald-500/10 text-emerald-400" },
];

export default function KanbanBoard({ tasks }: { tasks: Task[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        return (
          <div key={column.id} className="flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${column.color}`}>
                  {column.label}
                </span>
                <span className="text-xs font-bold text-zinc-600">{columnTasks.length}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 min-h-[500px]">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {columnTasks.length === 0 && (
                <div className="flex-1 rounded-[32px] border border-dashed border-white/5 flex items-center justify-center p-8">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">No tasks</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
