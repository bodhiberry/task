import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
const toNumber = process.env.TWILIO_WHATSAPP_TO;

if (!accountSid || !authToken) {
  console.warn("[Twilio] Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN — WhatsApp disabled.");
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

/**
 * Send a WhatsApp message via Twilio.
 * Uses the TWILIO_WHATSAPP_FROM and TWILIO_WHATSAPP_TO from environment variables.
 * Fails silently (logs error) so messaging issues never break app functionality.
 */
export async function sendWhatsApp(body: string): Promise<boolean> {
  if (!client) {
    console.warn("[Twilio] Client not initialized — skipping WhatsApp message.");
    return false;
  }

  if (!fromNumber || !toNumber) {
    console.warn("[Twilio] Missing TWILIO_WHATSAPP_FROM or TWILIO_WHATSAPP_TO — skipping WhatsApp message.");
    return false;
  }

  try {
    const message = await client.messages.create({
      body,
      from: fromNumber, // Already has whatsapp: prefix in .env
      to: toNumber, // Already has whatsapp: prefix in .env
    });
    console.log(`[Twilio] WhatsApp message sent — SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error("[Twilio] Failed to send WhatsApp message:", error);
    return false;
  }
}
