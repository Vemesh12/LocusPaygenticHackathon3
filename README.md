# AgentPay Tools

AgentPay Tools is a pay-per-use AI services marketplace built for Locus' Paygentic Hackathon #3. Humans and autonomous agents can discover small AI tools, purchase access with USDC through Checkout with Locus, and receive the result after payment.

## What it demonstrates

- Creates Checkout with Locus sessions on the server
- Renders the Locus checkout UI with `@withlocus/checkout-react`
- Uses the beta checkout URL for the hackathon
- Exposes agent-readable endpoints for tool discovery and paid execution
- Unlocks tool results after payment success or in local demo mode

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your Locus beta API key to `.env.local`. The public docs mention `@locus/agent-sdk`, but that package was not available on npm during setup, so this app uses a small HTTP adapter pointed at the confirmed beta checkout session endpoint.

```bash
LOCUS_API_KEY=your_key_here
LOCUS_SESSION_CREATE_URL=https://beta-api.paywithlocus.com/api/checkout/sessions
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_LOCUS_CHECKOUT_URL=https://beta.paywithlocus.com
```

If `LOCUS_API_KEY` is missing, the app creates mock checkout sessions so the demo flow still works locally.

## Locus usage

When a buyer chooses an AI service, the app calls `POST /api/checkout` and creates a Locus checkout session with the tool price, description, receipt data, success URL, cancel URL, webhook URL, and metadata. The checkout page renders `LocusCheckout` in embedded mode. On payment success, the UI unlocks the selected tool and lets the buyer run it.

## Agent endpoints

- `GET /api/tools` returns machine-readable paid services.
- `POST /api/checkout` creates a checkout session for a selected tool.
- `POST /api/run-tool` returns the paid tool result after a payment/session reference is supplied.
- `POST /api/webhooks/locus` accepts Locus payment lifecycle events.

## Hackathon disclosure

This project was built during Locus' Paygentic Hackathon #3. AI coding assistance was used for development support. Open-source libraries are listed in `package.json`. No prior hackathon project was reused.
