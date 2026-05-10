import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-8">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-zinc-500">Manage your workspace and security settings.</p>
      </header>

      <SettingsForm user={session.user} />
    </div>
  );
}
