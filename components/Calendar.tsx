"use client";

import { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  priority: string;
  status: string;
  dueDate?: Date | string | null;
}

export default function Calendar({ initialTasks }: { initialTasks: Task[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getTasksForDay = (day: Date) => {
    return initialTasks.filter((task) => 
      task.dueDate && isSameDay(new Date(task.dueDate), day)
    );
  };

  const priorityColors = {
    LOW: "bg-emerald-400",
    MEDIUM: "bg-amber-400",
    HIGH: "bg-rose-400",
  };

  return (
    <div className="glass-card rounded-[32px] border border-white/5 overflow-hidden">
      <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
        <h2 className="text-2xl font-bold text-white">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-white/5">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={idx}
              className={`min-h-[140px] p-3 border-r border-b border-white/5 transition-all hover:bg-white/[0.01] ${
                !isCurrentMonth ? "opacity-20" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-bold ${isToday ? "w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center -ml-1" : "text-zinc-500"}`}>
                  {format(day, "d")}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-black text-zinc-700 bg-white/5 px-1.5 rounded-md">
                    {dayTasks.length}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5 group transition-all hover:bg-white/10 cursor-pointer"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`} />
                    <span className="text-[10px] text-zinc-300 font-medium truncate group-hover:text-white">
                      {task.title}
                    </span>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[9px] font-bold text-zinc-600 pl-2">
                    + {dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
