import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTasks } from "@/app/actions/tasks";
import Calendar from "@/components/Calendar";

export default async function CalendarPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tasks = await getTasks();

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-8">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Calendar</h1>
        <p className="text-zinc-500">Keep track of your deadlines and schedule.</p>
      </header>

      <Calendar initialTasks={tasks} />
    </div>
  );
}
