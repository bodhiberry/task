"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Clock, PlayCircle, ChevronDown, Loader2 } from "lucide-react";
import { updateTaskStatus } from "@/app/actions/tasks";
import { motion, AnimatePresence } from "framer-motion";

const statuses = [
  { value: "TODO", label: "To Do", icon: Clock, color: "text-zinc-400", bg: "bg-zinc-400/10" },
  { value: "IN_PROGRESS", label: "In Progress", icon: PlayCircle, color: "text-blue-400", bg: "bg-blue-400/10" },
  { value: "DONE", label: "Completed", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

export default function TaskStatusToggle({ 
  taskId, 
  currentStatus 
}: { 
  taskId: string; 
  currentStatus: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const status = statuses.find(s => s.value === currentStatus) || statuses[0];
  const Icon = status.icon;

  const handleUpdate = (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }
    
    startTransition(async () => {
      await updateTaskStatus(taskId, newStatus as any);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 transition-all hover:bg-white/5 ${status.bg} ${status.color}`}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
        <span className="text-xs font-bold uppercase tracking-widest">{status.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-48 p-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-20"
          >
            <div className="space-y-1">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleUpdate(s.value)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
                    currentStatus === s.value 
                      ? "bg-white/5 text-white" 
                      : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                  }`}
                >
                  <s.icon className={`w-4 h-4 ${currentStatus === s.value ? s.color : ""}`} />
                  <span className="text-xs font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
