import { sendDueReminders } from "@/lib/notifications";
import { NextResponse } from "next/server";

/**
 * GET /api/reminders
 * 
 * Sends SMS reminders for tasks due within the next 24 hours.
 * Can be triggered by:
 *  - Vercel Cron (add to vercel.json)
 *  - External cron service
 *  - Manual API call
 */
export async function GET(request: Request) {
  // Optional: Add a secret key check for security
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sentCount = await sendDueReminders();

    return NextResponse.json({
      success: true,
      remindersSent: sentCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Reminders] Failed to send due-date reminders:", error);
    return NextResponse.json(
      { error: "Failed to process reminders" },
      { status: 500 }
    );
  }
}
