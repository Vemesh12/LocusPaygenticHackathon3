import { getTool } from "@/lib/tools";

type CheckoutRequest = {
  toolId: string;
  buyerId?: string;
};

export async function createCheckoutSession({ toolId, buyerId = "demo-buyer" }: CheckoutRequest) {
  const tool = getTool(toolId);

  if (!tool) {
    throw new Error("Unknown paid tool");
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  const sessionCreateUrl =
    process.env.LOCUS_SESSION_CREATE_URL ||
    "https://beta-api.paywithlocus.com/api/checkout/sessions";

  if (!process.env.LOCUS_API_KEY) {
    return {
      id: `mock_${tool.id}_${Date.now()}`,
      amount: tool.price,
      currency: "USDC",
      description: `${tool.name} access`,
      mode: "mock" as const,
    };
  }

  const payload = {
    amount: tool.price,
    description: `${tool.name} access`,
    successUrl: `${baseUrl}/?paid=${tool.id}`,
    cancelUrl: baseUrl,
    webhookUrl: `${baseUrl}/api/webhooks/locus`,
    metadata: {
      toolId: tool.id,
      buyerId,
      product: "agentpay-tools",
    },
    receiptConfig: {
      enabled: true,
      fields: {
        creditorName: "AgentPay Tools",
        lineItems: [{ description: tool.name, amount: tool.price }],
        subtotal: tool.price,
        taxRate: "0%",
        taxAmount: "0.00",
        supportEmail: "support@agentpay.tools",
      },
    },
  };

  const response = await fetch(sessionCreateUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LOCUS_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Locus session creation failed");
  }

  const session = await response.json();

  return {
    id: session.id,
    amount: tool.price,
    currency: "USDC",
    description: `${tool.name} access`,
    mode: "locus" as const,
    expiresAt: session.expiresAt,
  };
}
