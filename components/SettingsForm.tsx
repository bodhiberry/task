"use client";

import { useState, useEffect } from "react";
import { updateProfile, updatePassword, updatePhone, getPhone } from "@/app/actions/user";
import { User, Lock, Shield, Eye, EyeOff, CheckCircle2, AlertCircle, MessageSquare, Phone, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

interface UserData {
  name?: string | null;
  email?: string | null;
}

export default function SettingsForm({ user }: { user: UserData }) {
  const [name, setName] = useState(user.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);

  // Phone / SMS state
  const [phone, setPhone] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneSaved, setPhoneSaved] = useState(false);

  useEffect(() => {
    getPhone().then((p) => {
      if (p) setPhone(p);
    });
  }, []);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await updateProfile({ name });
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const result = await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Password updated successfully" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update password" });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePhone(e: React.FormEvent) {
    e.preventDefault();
    setPhoneLoading(true);
    setMessage(null);
    try {
      const result = await updatePhone({ phone });
      if (result?.success) {
        setMessage({ type: "success", text: phone ? "WhatsApp notifications enabled!" : "WhatsApp notifications disabled." });
        setPhoneSaved(true);
        setTimeout(() => setPhoneSaved(false), 3000);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Invalid phone number format. Use E.164 (e.g. +1234567890)" });
    } finally {
      setPhoneLoading(false);
    }
  }

  const smsEnabled = phone && /^\+[1-9]\d{1,14}$/.test(phone);

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      {/* Profile Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Profile Information</h2>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-8">
          <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Your Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Email Address</label>
              <input
                value={user.email || ""}
                disabled
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-zinc-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-zinc-600 ml-1 italic">Email cannot be changed.</p>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-2xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </section>


      {/* Security Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Account Security</h2>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-white/5">
          <form onSubmit={handleUpdatePassword} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Current Password</label>
                <div className="relative group">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">New Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Confirm New Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Toast Notification */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl z-[200] ${
            message.type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-semibold">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-4 text-white/50 hover:text-white">
            <XIcon className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

function XIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
