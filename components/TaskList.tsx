"use client";

import { useState } from "react";
import TaskCard from "./TaskCard";
import KanbanBoard from "./KanbanBoard";
import { Search, Filter, X, LayoutGrid, List } from "lucide-react";

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

export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [view, setView] = useState<"LIST" | "KANBAN">("LIST");

  const filteredTasks = initialTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                         task.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-6 w-full xl:w-auto">
          <div className="relative group flex-1 md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-5 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
            <button
              onClick={() => setView("LIST")}
              className={`p-2 rounded-xl transition-all ${view === "LIST" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-zinc-500 hover:text-white"}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView("KANBAN")}
              className={`p-2 rounded-xl transition-all ${view === "KANBAN" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-zinc-500 hover:text-white"}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          >
            <option value="ALL" className="bg-zinc-900">All Status</option>
            <option value="TODO" className="bg-zinc-900">To Do</option>
            <option value="IN_PROGRESS" className="bg-zinc-900">In Progress</option>
            <option value="DONE" className="bg-zinc-900">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          >
            <option value="ALL" className="bg-zinc-900">All Priority</option>
            <option value="LOW" className="bg-zinc-900">Low</option>
            <option value="MEDIUM" className="bg-zinc-900">Medium</option>
            <option value="HIGH" className="bg-zinc-900">High</option>
          </select>

          {(search || statusFilter !== "ALL" || priorityFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
                setPriorityFilter("ALL");
              }}
              className="flex items-center gap-2 px-3 py-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="text-xs font-medium">Clear</span>
            </button>
          )}
        </div>
      </div>

      {view === "KANBAN" ? (
        <KanbanBoard tasks={filteredTasks} />
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-20 text-center border border-dashed border-white/10">
          <p className="text-zinc-500">No tasks match your filters.</p>
        </div>
      )}
    </div>
  );
}
