"use client";

import { useState, useTransition } from "react";
import { Paperclip, X, Image as ImageIcon, File, Loader2, Plus, Download, ExternalLink, Eye } from "lucide-react";

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
  const [selectedImage, setSelectedImage] = useState<Attachment | null>(null);

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
            {attachments.map((file) => {
              const fileIsImg = isImage(file.url);
              
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative aspect-square rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden hover:border-white/20 transition-all cursor-pointer"
                >
                  {fileIsImg ? (
                    <div 
                      onClick={() => setSelectedImage(file)}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={file.url}
                        alt={file.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Premium overlay with filename & eye icon */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5">
                        <div className="self-end p-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Image Attachment</p>
                          <p className="text-xs font-semibold text-white truncate w-full">{file.name}</p>
                        </div>
                      </div>
                      
                      {/* Gradient for filename display when not hovered */}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 group-hover:opacity-0 transition-opacity">
                        <p className="text-[11px] font-medium text-zinc-200 truncate">{file.name}</p>
                      </div>
                    </div>
                  ) : (
                    <a 
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex flex-col items-center justify-center p-4"
                    >
                      <File className="w-8 h-8 text-zinc-500 mb-2 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-xs font-medium text-zinc-300 truncate w-full text-center px-2">
                        {file.name}
                      </span>
                      
                      {/* Premium overlay for document */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5">
                        <div className="self-end p-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white">
                          <Download className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">File Attachment</p>
                          <p className="text-xs font-semibold text-white truncate w-full">{file.name}</p>
                        </div>
                      </div>
                    </a>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Lightbox / Previewer Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col bg-zinc-950/80 border border-white/10 rounded-[24px] overflow-hidden shadow-2xl z-10"
            >
              {/* Lightbox Header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-zinc-900/40">
                <div className="min-w-0 pr-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-400">Attachment Preview</p>
                  <h4 className="text-sm font-semibold text-white truncate">{selectedImage.name}</h4>
                </div>
                
                <div className="flex items-center gap-2">
                  <a
                    href={selectedImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={selectedImage.url}
                    download={selectedImage.name}
                    className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <div className="h-5 w-[1px] bg-white/10 mx-1" />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lightbox Image View */}
              <div className="flex-1 overflow-hidden p-6 sm:p-12 flex items-center justify-center min-h-[300px]">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg select-none"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
