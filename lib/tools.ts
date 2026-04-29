export type ToolId = "summarizer" | "copywriter" | "code-review" | "extractor";

export type PaidTool = {
  id: ToolId;
  name: string;
  price: string;
  category: string;
  description: string;
  placeholder: string;
};

export const paidTools: PaidTool[] = [
  {
    id: "summarizer",
    name: "Briefing Agent",
    price: "0.50",
    category: "Research",
    description: "Turns long notes, docs, or transcripts into a crisp executive brief.",
    placeholder: "Paste a messy meeting transcript, article, or research note...",
  },
  {
    id: "copywriter",
    name: "Launch Copy Agent",
    price: "1.00",
    category: "Marketing",
    description: "Creates product positioning, landing copy, and a short social post.",
    placeholder: "Describe the product, target customer, and key benefit...",
  },
  {
    id: "code-review",
    name: "Code Review Agent",
    price: "1.50",
    category: "Developer",
    description: "Reviews a code snippet for bugs, risks, edge cases, and missing tests.",
    placeholder: "Paste a function, component, route, or diff for review...",
  },
  {
    id: "extractor",
    name: "Data Extractor Agent",
    price: "2.00",
    category: "Operations",
    description: "Extracts structured JSON from invoices, emails, orders, and support notes.",
    placeholder: "Paste unstructured text that contains names, dates, amounts, or tasks...",
  },
];

export function getTool(toolId: string) {
  return paidTools.find((tool) => tool.id === toolId);
}

export function runDemoTool(tool: PaidTool, input: string) {
  const cleaned = input.trim();
  const preview = cleaned.length > 180 ? `${cleaned.slice(0, 180)}...` : cleaned;

  if (!cleaned) {
    return "Add input for the paid agent to process.";
  }

  if (tool.id === "summarizer") {
    return `Executive brief\n\nSummary: ${preview}\n\nKey points:\n- Main request detected and compressed into action-focused language.\n- Useful details were preserved while repeated wording was removed.\n- Recommended next step: send this brief to the buyer or agent that requested it.`;
  }

  if (tool.id === "copywriter") {
    return `Launch copy\n\nHeadline: Ship paid AI services without rebuilding payments.\n\nSubcopy: ${preview}\n\nSocial post: We just launched a USDC-paid AI workflow where humans and agents can buy useful micro-services on demand. Powered by Checkout with Locus.`;
  }

  if (tool.id === "code-review") {
    return `Code review\n\nFinding 1: Validate input before executing paid work.\nFinding 2: Store the Locus session ID with each result for auditability.\nFinding 3: Add webhook verification before treating server-side payments as final.\n\nReviewed snippet preview: ${preview}`;
  }

  return `Structured extraction\n\n{\n  "sourcePreview": ${JSON.stringify(preview)},\n  "detectedIntent": "paid_agent_task",\n  "recommendedFields": ["buyer", "service", "amount", "status"],\n  "confidence": 0.87\n}`;
}
