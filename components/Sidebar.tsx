"use client";

import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Settings, 
  LogOut,
  User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import Image from "next/image";

export default function Sidebar({ user }: { user: { name?: string | null; email?: string | null; image?: string | null } }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: CheckSquare, label: "Tasks", href: "/tasks" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <aside className="shrink-0 w-64 h-screen sticky top-0 glass border-r border-white/5 flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <CheckSquare className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight gradient-text">TaskFlow</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-500/10 text-blue-400" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "group-hover:text-white"}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-3 px-2 py-1">
          {user.image ? (
            <Image 
              src={user.image} 
              alt={user.name || "User"} 
              width={40}
              height={40}
              className="rounded-full border border-white/10" 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
              <UserIcon className="w-5 h-5 text-zinc-400" />
            </div>
          )}
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">{user.name || "User"}</span>
            <span className="text-xs text-zinc-500 truncate">{user.email}</span>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
