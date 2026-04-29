"use client";

import { CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { LocusCheckout } from "@withlocus/checkout-react";

type CheckoutPaneProps = {
  sessionId: string;
  mode: "mock" | "locus";
  onPaid: (txHash?: string) => void;
};

export function CheckoutPane({ sessionId, mode, onPaid }: CheckoutPaneProps) {
  if (mode === "mock") {
    return (
      <div className="mock-checkout">
        <ShieldCheck size={34} />
        <div>
          <strong>Local demo checkout</strong>
          <p>
            Add `LOCUS_API_KEY` to use a real beta Locus checkout session. This button simulates
            payment success for demo recording and UI testing.
          </p>
        </div>
        <button className="primary-btn" type="button" onClick={() => onPaid("mock_tx_hash")}>
          <CheckCircle2 size={18} />
          Mark as paid
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="status">
        <ExternalLink size={16} />
        Beta checkout session: {sessionId}
      </div>
      <LocusCheckout
        sessionId={sessionId}
        mode="embedded"
        checkoutUrl={process.env.NEXT_PUBLIC_LOCUS_CHECKOUT_URL || "https://beta.paywithlocus.com"}
        onSuccess={(data) => onPaid(data.txHash)}
        onError={(error) => console.error("Checkout error:", error.message)}
      />
    </div>
  );
}
