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
  assignedToId: z.string().optional(),
  progress: z.number().min(0).max(100).default(0),
});

export async function createTask(formData: z.infer<typeof TaskSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { title, description, priority, dueDate, assignedToId, progress } = formData;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      progress,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: session.user.id,
      assignedToId: assignedToId || null,
      status: "TODO",
    },
  });

  await prisma.activity.create({
    data: {
      type: "TASK_CREATED",
      message: `Created task "${title}"`,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function updateTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await prisma.task.update({
    where: { id: taskId, userId: session.user.id },
    data: { 
      status,
      progress: status === "DONE" ? 100 : undefined
    },
  });

  await prisma.activity.create({
    data: {
      type: "TASK_UPDATED",
      message: `Marked "${task.title}" as ${status.toLowerCase().replace("_", " ")}`,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await prisma.task.findUnique({
    where: { id: taskId, userId: session.user.id },
  });

  if (!task) throw new Error("Task not found");

  await prisma.task.delete({
    where: { id: taskId, userId: session.user.id },
  });

  await prisma.activity.create({
    data: {
      type: "TASK_DELETED",
      message: `Deleted task "${task.title}"`,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function getTasks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        { assignedToId: session.user.id }
      ]
    },
    include: {
      assignedTo: {
        select: { name: true, image: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return tasks.map((task: any) => ({
    ...task,
    dueDate: task.dueDate?.toISOString() || null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }));
}

export async function getTask(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, image: true } },
      assignedTo: { select: { id: true, name: true, image: true } },
      subtasks: { orderBy: { createdAt: "asc" } },
    }
  });

  if (!task) return null;

  return {
    ...task,
    dueDate: task.dueDate?.toISOString() || null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    subtasks: task.subtasks.map((st: any) => ({
      ...st,
      createdAt: st.createdAt.toISOString(),
      updatedAt: st.updatedAt.toISOString(),
    })),
  };
}

export async function getUsers() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.user.findMany({
    select: { id: true, name: true, image: true }
  });
}

export async function getActivities() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const activities = await prisma.activity.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return activities.map((a: any) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));
}

export async function createSubtask(taskId: string, title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.subtask.create({
    data: { title, taskId }
  });

  revalidatePath(`/tasks/${taskId}`);
}

export async function toggleSubtask(subtaskId: string, isCompleted: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const subtask = await prisma.subtask.update({
    where: { id: subtaskId },
    data: { isCompleted }
  });

  revalidatePath(`/tasks/${subtask.taskId}`);
}

export async function deleteSubtask(subtaskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const subtask = await prisma.subtask.delete({
    where: { id: subtaskId }
  });

  revalidatePath(`/tasks/${subtask.taskId}`);
}

export async function assignTask(taskId: string, userId: string | null) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.task.update({
    where: { id: taskId },
    data: { assignedToId: userId }
  });

  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}
