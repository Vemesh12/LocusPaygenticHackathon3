"use client";

import {
  BadgeDollarSign,
  Bot,
  Braces,
  CheckCircle2,
  Code2,
  FileText,
  PenLine,
  Play,
  ReceiptText,
  Rows3,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CheckoutPane } from "@/components/CheckoutPane";
import { paidTools, type PaidTool } from "@/lib/tools";

type CheckoutSession = {
  id: string;
  amount: string;
  currency: string;
  description: string;
  mode: "mock" | "locus";
};

const icons = {
  summarizer: FileText,
  copywriter: PenLine,
  "code-review": Code2,
  extractor: Braces,
};

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<PaidTool>(paidTools[0]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [paid, setPaid] = useState(false);
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("Choose a paid AI service to begin.");
  const [loading, setLoading] = useState(false);

  const selectedIcon = useMemo(() => icons[selectedTool.id], [selectedTool]);
  const SelectedIcon = selectedIcon;

  async function createCheckout(tool: PaidTool) {
    setSelectedTool(tool);
    setPaid(false);
    setResult("");
    setLoading(true);
    setStatus("Creating Locus checkout session...");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolId: tool.id, buyerId: "hackathon-demo-buyer" }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setStatus(data.error || "Checkout session failed.");
      return;
    }

    setSession(data.session);
    setStatus(
      data.session.mode === "mock"
        ? "Demo checkout ready. Add LOCUS_API_KEY for real Locus payments."
        : "Locus checkout ready. Complete payment to unlock the tool.",
    );
  }

  async function runTool() {
    if (!session || !paid) {
      setStatus("Complete payment before running the paid tool.");
      return;
    }

    setLoading(true);
    setStatus("Running paid agent...");

    const response = await fetch("/api/run-tool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolId: selectedTool.id,
        input,
        sessionId: session.id,
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setStatus(data.error || "Tool execution failed.");
      return;
    }

    setResult(data.result);
    setStatus("Paid result delivered.");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">AP</div>
          <div>
            <h1>AgentPay Tools</h1>
            <p>USDC-paid AI services for humans and agents</p>
          </div>
        </div>
        <p className="nav-note">Built for Locus Paygentic Hackathon #3</p>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <h2>Pay-per-use AI work, unlocked by Locus Checkout.</h2>
          <p>
            A marketplace where people and autonomous agents discover small AI services, pay in
            USDC, and receive results instantly. One flow works for human buyers and machine buyers.
          </p>
        </div>

        <aside className="hero-panel" aria-label="Payment flow">
          <div className="agent-card">
            <h3>Machine-readable commerce flow</h3>
            <div className="signal-row">
              <span>Discovery</span>
              <strong>GET /api/tools</strong>
            </div>
            <div className="signal-row">
              <span>Payment</span>
              <strong>Locus Checkout</strong>
            </div>
            <div className="signal-row">
              <span>Settlement</span>
              <strong>USDC on Base</strong>
            </div>
            <div className="signal-row">
              <span>Fulfillment</span>
              <strong>POST /api/run-tool</strong>
            </div>
          </div>
          <div className="status">
            <Sparkles size={18} />
            Checkout sessions, receipts, webhooks, and paid fulfillment.
          </div>
        </aside>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Paid AI services</h2>
            <p>Select a service, create a Locus checkout session, then unlock the output.</p>
          </div>
          <div className="tag">Beta: {process.env.NEXT_PUBLIC_LOCUS_CHECKOUT_URL || "beta.paywithlocus.com"}</div>
        </div>

        <div className="grid">
          {paidTools.map((tool) => {
            const ToolIcon = icons[tool.id];
            const active = tool.id === selectedTool.id;

            return (
              <article className="tool-card" key={tool.id}>
                <div className="tool-icon">
                  <ToolIcon size={22} />
                </div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <div className="price-row">
                  <span className="price">{tool.price} USDC</span>
                  <span className="tag">{tool.category}</span>
                </div>
                <button className="primary-btn" disabled={loading && active} onClick={() => createCheckout(tool)}>
                  <BadgeDollarSign size={18} />
                  {active && session ? "Refresh checkout" : "Pay with Locus"}
                </button>
              </article>
            );
          })}
        </div>

        <div className="workspace">
          <section className="panel">
            <h3>
              <SelectedIcon size={18} /> {selectedTool.name}
            </h3>
            <div className="form-stack">
              <textarea
                className="textarea"
                placeholder={selectedTool.placeholder}
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <div className="status">
                {paid ? <CheckCircle2 size={16} /> : <ReceiptText size={16} />}
                {status}
              </div>
              <button className="secondary-btn" disabled={!paid || loading} onClick={runTool}>
                <Play size={18} />
                Run paid agent
              </button>
            </div>
          </section>

          <section className="panel">
            <h3>
              <Rows3 size={18} /> Checkout and result
            </h3>
            <div className="checkout-box">
              {session ? (
                <CheckoutPane
                  sessionId={session.id}
                  mode={session.mode}
                  onPaid={() => {
                    setPaid(true);
                    setStatus("Payment confirmed. The selected AI service is unlocked.");
                  }}
                />
              ) : (
                <div className="mock-checkout">
                  <Bot size={34} />
                  <p>
                    Choose a paid service to create a checkout session. Agents can also discover
                    services from <code>/api/tools</code>.
                  </p>
                </div>
              )}
            </div>

            <div className="result" aria-live="polite">
              {result || "Paid result will appear here after checkout confirmation."}
            </div>
          </section>
        </div>

        <div className="api-strip">
          <div>
            <strong>Agent-readable API</strong>
            <p className="brand p">Autonomous buyers can discover services, create sessions, and request fulfillment.</p>
          </div>
          <code>GET /api/tools</code>
        </div>
      </section>
    </main>
  );
}
