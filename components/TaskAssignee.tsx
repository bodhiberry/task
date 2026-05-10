"use client";

import { useState, useTransition } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { assignTask } from "@/app/actions/tasks";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  name: string | null;
  image: string | null;
}

export default function TaskAssignee({ 
  taskId, 
  currentAssignee, 
  users 
}: { 
  taskId: string; 
  currentAssignee: User | null;
  users: User[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAssign = (userId: string | null) => {
    startTransition(async () => {
      await assignTask(taskId, userId);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            {currentAssignee?.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-0.5">Assigned To</p>
            <p className="text-sm font-bold text-white">{currentAssignee?.name || "Unassigned"}</p>
          </div>
        </div>
        {isPending ? <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" /> : <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full mt-2 p-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl z-10"
          >
            <div className="max-h-48 overflow-y-auto space-y-1">
              <button
                onClick={() => handleAssign(null)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
                    U
                  </div>
                  <span className="text-sm text-zinc-300">Unassigned</span>
                </div>
                {!currentAssignee && <Check className="w-4 h-4 text-blue-500" />}
              </button>
              
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleAssign(user.id)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      {user.name?.charAt(0)}
                    </div>
                    <span className="text-sm text-zinc-300">{user.name}</span>
                  </div>
                  {currentAssignee?.id === user.id && <Check className="w-4 h-4 text-blue-500" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
