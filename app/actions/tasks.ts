"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.string().optional(),
});

export async function createTask(formData: z.infer<typeof TaskSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { title, description, priority, dueDate } = formData;

  await prisma.task.create({
    data: {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: session.user.id,
      status: "TODO",
    },
  });

  revalidatePath("/dashboard");
}

export async function updateTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.task.update({
    where: { id: taskId, userId: session.user.id },
    data: { status },
  });

  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.task.delete({
    where: { id: taskId, userId: session.user.id },
  });

  revalidatePath("/dashboard");
}

export async function getTasks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}
