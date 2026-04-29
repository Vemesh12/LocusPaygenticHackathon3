import { NextResponse } from "next/server";
import { paidTools } from "@/lib/tools";

export async function GET() {
  return NextResponse.json({
    name: "AgentPay Tools",
    protocol: "locus-checkout",
    currency: "USDC",
    buyerTypes: ["human", "ai_agent"],
    tools: paidTools.map((tool) => ({
      ...tool,
      checkoutEndpoint: "/api/checkout",
      runEndpoint: "/api/run-tool",
    })),
  });
}
