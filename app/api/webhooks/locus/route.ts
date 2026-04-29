import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));

  // In production, verify the Locus signature with LOCUS_WEBHOOK_SECRET before fulfillment.
  console.log("Locus webhook received", payload);

  return NextResponse.json({
    received: true,
    message: "Webhook accepted. Add signature verification before production use.",
  });
}
