import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession } from "@/lib/locus";

const checkoutSchema = z.object({
  toolId: z.string().min(1),
  buyerId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = checkoutSchema.parse(await req.json());
    const session = await createCheckoutSession(body);

    return NextResponse.json({ session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create checkout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
