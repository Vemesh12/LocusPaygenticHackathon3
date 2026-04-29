import { NextResponse } from "next/server";
import { z } from "zod";
import { getTool, runDemoTool } from "@/lib/tools";

const runSchema = z.object({
  toolId: z.string().min(1),
  input: z.string().min(1),
  sessionId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = runSchema.parse(await req.json());
    const tool = getTool(body.toolId);

    if (!tool) {
      return NextResponse.json({ error: "Unknown paid tool" }, { status: 404 });
    }

    const result = runDemoTool(tool, body.input);

    return NextResponse.json({
      status: "completed",
      sessionId: body.sessionId,
      toolId: tool.id,
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to run tool";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
