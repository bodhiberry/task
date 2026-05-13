"use client";

import { useState, useTransition } from "react";
import { Paperclip, X, Image as ImageIcon, File, Loader2, Plus } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { addAttachment, uploadFile } from "@/app/actions/tasks";

interface Attachment {
  id: string;
  name: string;
  url: string;
  fileType?: string | null;
}

export default function TaskAttachments({ 
  taskId, 
  attachments: initialAttachments 
}: { 
  taskId: string; 
  attachments: Attachment[] 
}) {
  const [attachments, setAttachments] = useState(initialAttachments);
  const [isPending, startTransition] = useTransition();

  const isImage = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null || url.includes("cloudinary");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
          <Paperclip className="w-3 h-3" />
          Attachments ({attachments.length})
        </h3>
        
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              
              const formData = new FormData();
              formData.append("file", file);
              
              startTransition(async () => {
                const result: any = await uploadFile(formData);
                const newAttachment = {
                  name: result.name,
                  url: result.url,
                  fileType: result.fileType,
                };
                await addAttachment(taskId, newAttachment);
                setAttachments([...attachments, { ...newAttachment, id: Math.random().toString() } as any]);
              });
            }}
          />
          <button 
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={isPending}
            className="text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
            {isPending ? "Uploading..." : "Add"}
          </button>
        </div>
      </div>

      {attachments.length === 0 ? (
        <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
          <p className="text-sm text-zinc-700">No attachments yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <AnimatePresence>
            {attachments.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden hover:border-white/20 transition-all"
              >
                {isImage(file.url) ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <File className="w-8 h-8 text-zinc-700 mb-2" />
                    <span className="text-[10px] text-zinc-500 truncate w-full text-center">
                      {file.name}
                    </span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
