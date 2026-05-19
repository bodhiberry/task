"use client";

import { useState, useEffect } from "react";
import { Plus, X, Paperclip, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createTask, getUsers, uploadFile } from "@/app/actions/tasks";


interface User {
  id: string;
  name: string | null;
  image: string | null;
}

export default function CreateTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [attachments, setAttachments] = useState<{name: string, url: string, fileType: string}[]>([]);

  useEffect(() => {
    if (isOpen) {
      getUsers().then(setUsers);
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await createTask({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        priority: formData.get("priority") as "LOW" | "MEDIUM" | "HIGH",
        dueDate: formData.get("dueDate") as string,
        assignedToId: formData.get("assignedToId") as string,
        progress: parseInt(formData.get("progress") as string) || 0,
        attachments,
      });
      setIsOpen(false);
      setAttachments([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25"
      >
        <Plus className="w-5 h-5" />
        New Task
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-zinc-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
            >
              {/* Fixed Header */}
              <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white">Create New Task</h2>
                  <p className="text-sm text-zinc-500">Add a new item to your workspace</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form with Scrollable Body and Fixed Footer */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Task Title</label>
                    <input
                      name="title"
                      required
                      placeholder="e.g., Design System Update"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="Add more details about this task..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Priority</label>
                      <select
                        name="priority"
                        defaultValue="MEDIUM"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                      >
                        <option value="LOW" className="bg-zinc-900">Low Priority</option>
                        <option value="MEDIUM" className="bg-zinc-900">Medium Priority</option>
                        <option value="HIGH" className="bg-zinc-900">High Priority</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Due Date</label>
                      <input
                        type="date"
                        name="dueDate"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Assign To</label>
                      <select
                        name="assignedToId"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                      >
                        <option value="" className="bg-zinc-900">Unassigned</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id} className="bg-zinc-900">
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Progress (%)</label>
                      <input
                        type="number"
                        name="progress"
                        min="0"
                        max="100"
                        defaultValue="0"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Attachments</label>
                    <div className="flex flex-wrap gap-3">
                      <input
                        type="file"
                        id="modal-file-upload"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          setLoading(true);
                          const formData = new FormData();
                          formData.append("file", file);
                          
                          try {
                            const result: any = await uploadFile(formData);
                            setAttachments([...attachments, {
                              name: result.name,
                              url: result.url,
                              fileType: result.fileType
                            }]);
                          } catch (error) {
                            console.error(error);
                          } finally {
                            setLoading(false);
                          }
                        }}
                      />
                      {attachments.map((file, i) => (
                        <div key={i} className="group relative w-16 h-16 rounded-xl bg-zinc-800 border border-white/10 overflow-hidden">
                          {file.fileType.match(/(jpg|jpeg|png|webp)/) ? (
                            <img src={file.url} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Paperclip className="w-4 h-4 text-zinc-500" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => document.getElementById("modal-file-upload")?.click()}
                        disabled={loading}
                        className="w-16 h-16 rounded-xl border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-blue-500 hover:border-blue-500/50 transition-all disabled:opacity-50"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-8 pt-4 border-t border-white/5 flex gap-4 bg-zinc-950/40 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-8 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-8 py-4 rounded-2xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
