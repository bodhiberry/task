"use client";

import { useState, useTransition } from "react";
import { Plus, Check, X, Loader2 } from "lucide-react";
import { createSubtask, toggleSubtask, deleteSubtask } from "@/app/actions/tasks";
import { motion, AnimatePresence } from "framer-motion";

interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export default function SubtaskList({ taskId, subtasks }: { taskId: string; subtasks: Subtask[] }) {
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    startTransition(async () => {
      await createSubtask(taskId, title);
      setTitle("");
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Subtasks & Checklist</h3>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {subtasks.map((st) => (
            <motion.div
              key={st.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all"
            >
              <div 
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => startTransition(() => toggleSubtask(st.id, !st.isCompleted))}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${st.isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'border-zinc-700 text-transparent group-hover:border-zinc-500'}`}>
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className={`text-sm select-none transition-all ${st.isCompleted ? "text-zinc-600 line-through" : "text-zinc-300"}`}>
                  {st.title}
                </span>
              </div>
              <button 
                onClick={() => startTransition(() => deleteSubtask(st.id))}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleCreate} className="relative mt-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new subtask..."
          className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
          disabled={isPending}
        />
        <button 
          type="submit" 
          disabled={!title.trim() || isPending}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-blue-400 disabled:opacity-50 disabled:hover:text-zinc-500 transition-colors"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
