import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTasks } from "@/app/actions/tasks";
import TaskList from "@/components/TaskList";
import CreateTaskModal from "@/components/CreateTaskModal";

export default async function TasksPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tasks = await getTasks();

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">All Tasks</h1>
          <p className="text-zinc-500">Manage and filter your entire task collection.</p>
        </div>
        <CreateTaskModal />
      </header>

      <TaskList initialTasks={tasks} />
    </div>
  );
}
