import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Calendar</h1>
      <p className="text-zinc-500">Track your deadlines and events.</p>
      <div className="mt-12 glass-card rounded-3xl p-12 text-center border border-white/5">
        <p className="text-zinc-400">Calendar view coming soon.</p>
      </div>
    </div>
  );
}
