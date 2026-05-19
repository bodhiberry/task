"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const PasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export async function updateProfile(formData: z.infer<typeof ProfileSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { name } = formData;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  revalidatePath("/");
}

export async function updatePassword(formData: z.infer<typeof PasswordSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { currentPassword, newPassword } = formData;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.password) {
    throw new Error("User not found or password not set");
  }

  const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordsMatch) {
    return { error: "Current password is incorrect" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}

const PhoneSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, "Phone must be in E.164 format (e.g. +1234567890)").or(z.literal("")),
});

export async function updatePhone(formData: z.infer<typeof PhoneSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { phone } = formData;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { phone: phone || null },
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function getPhone(): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { phone: true },
  });

  return user?.phone || null;
}
