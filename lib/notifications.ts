import { prisma } from "@/lib/prisma";
import { sendWhatsApp } from "@/lib/twilio";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getUserName(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  return user?.name || "Someone";
}

// ─── Notification Functions ─────────────────────────────────────────────────

/**
 * Notify when a new task is created.
 */
export async function notifyTaskCreated(
  taskTitle: string,
  creatorId: string,
) {
  const creatorName = await getUserName(creatorId);
  const body = `📋 TaskFlow: New task created — "${taskTitle}" by ${creatorName}.`;
  void sendWhatsApp(body);
}

/**
 * Notify when a task status is updated.
 */
export async function notifyTaskStatusUpdated(
  taskId: string,
  taskTitle: string,
  newStatus: string,
  updatedById: string,
) {
  const updaterName = await getUserName(updatedById);
  const statusLabel = newStatus.toLowerCase().replace("_", " ");
  const body = `🔄 TaskFlow: "${taskTitle}" was marked as ${statusLabel} by ${updaterName}.`;
  
  void sendWhatsApp(body);
}

/**
 * Notify when a task is deleted.
 */
export async function notifyTaskDeleted(
  taskTitle: string,
  deletedById: string,
) {
  const deleterName = await getUserName(deletedById);
  const body = `🗑️ TaskFlow: Task "${taskTitle}" has been deleted by ${deleterName}.`;
  void sendWhatsApp(body);
}

/**
 * Notify when a task is assigned to a user.
 */
export async function notifyTaskAssigned(
  taskTitle: string,
  assigneeId: string,
  assignerName: string,
) {
  const assigneeName = await getUserName(assigneeId);
  const body = `👤 TaskFlow: ${assignerName} assigned a task — "${taskTitle}" to ${assigneeName}.`;
  void sendWhatsApp(body);
}

/**
 * Send due-date reminders for tasks due within the next 24 hours.
 */
export async function sendDueReminders(): Promise<number> {
  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const tasks = await prisma.task.findMany({
    where: {
      dueDate: {
        gte: now,
        lte: in24Hours,
      },
      status: { not: "DONE" },
    },
    include: {
      user: { select: { name: true } },
      assignedTo: { select: { name: true } },
    },
  });

  let sentCount = 0;

  for (const task of tasks) {
    const dueLabel = task.dueDate!.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    const assigneeStr = task.assignedTo ? ` (Assigned to: ${task.assignedTo.name})` : "";
    const body = `⏰ TaskFlow Reminder: "${task.title}" is due on ${dueLabel}${assigneeStr}.`;

    const sent = await sendWhatsApp(body);
    if (sent) sentCount++;
  }

  return sentCount;
}
