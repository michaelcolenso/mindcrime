# ScopeWise — AI-Powered Project Proposal Generator for Freelancers

**Turn project briefs into professional proposals in 60 seconds.**

ScopeWise helps freelance developers, designers, and consultants generate complete, professional project proposals using AI. Stop spending hours on paperwork. Win more clients.

## The Product

### Problem
Freelancers waste 4-8 hours per week writing project proposals, scope-of-work documents, and statements of work. Existing tools (Proposify, PandaDoc) cost $49-99/month and are built for enterprise sales teams — complete overkill for a solo freelancer sending 3-10 proposals a month.

### Solution
Fill in a short form (project description, client name, budget, timeline). ScopeWise uses Claude AI to generate a complete proposal in 60 seconds:
- Executive summary tailored to the client
- Full scope of work with explicit "not included" section
- Deliverables list
- Milestone breakdown with payment schedule
- Investment table with pricing breakdown
- Terms & conditions (revisions, warranty, IP ownership, change requests)
- Next steps for the client

Every proposal gets a unique shareable link — clients view it without logging in, and you can print to PDF from the browser.

### Pricing
- **Free**: 2 proposals (to try the product)
- **Starter**: $19/month — 20 proposals/month
- **Pro**: $39/month — unlimited proposals

### Target Customer
Freelance web developers, UI/UX designers, digital marketers, and small dev agencies (2-10 people) who regularly write client proposals.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | SvelteKit 2 + Svelte 5 | Fast, minimal overhead, great DX |
| Database | Turso (LibSQL/SQLite) + Drizzle ORM | Serverless SQLite, $0 at startup |
| Auth | Lucia v3 (Google OAuth + magic link) | No vendor lock-in, ships fast |
| AI | Claude (claude-opus-4-5 via Anthropic SDK) | Best-in-class writing quality |
| Payments | Stripe (subscriptions) | Industry standard |
| Email | Postmark | Reliable transactional email |
| Analytics | PostHog | Self-serve product analytics |
| Hosting | Vercel | Zero-DevOps serverless deployment |
| Styling | Tailwind CSS + DaisyUI | Fast, professional UI without a designer |

**Monthly infrastructure cost at launch: ~$0-20**
- Vercel: Free tier
- Turso: Free tier (5GB, 1B rows read/month)
- Anthropic API: ~$0.015 per proposal (claude-opus-4-5)
- Postmark: $10/month after free tier

---

## Local Development

### Prerequisites
- Node.js 18+
- npm or pnpm

### Setup

1. **Clone and install**
   ```bash
   git clone <repo>
   cd scopewise
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Fill in `.env` with your values (see below for required services).

3. **Create local database and run migrations**
   ```bash
   npm run generate
   npm run migrate
   ```

4. **Install Mailpit for local email testing**
   ```bash
   # macOS
   brew install axllent/apps/mailpit
   mailpit
   ```
   Then set in `.env`:
   ```
   POSTMARK_SERVER_TOKEN=test-token
   FROM_EMAIL=test@scopewise.app
   ```
   (In dev mode, magic link URLs are logged to the console automatically)

5. **Start dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

---

## Required Services & Environment Variables

### 1. Anthropic API (Required for AI generation)
- Sign up at [console.anthropic.com](https://console.anthropic.com)
- Create an API key
- Set `ANTHROPIC_API_KEY=sk-ant-...`

### 2. Turso Database (Required)
- Sign up at [turso.tech](https://turso.tech)
- Create a database: `turso db create scopewise`
- Get URL: `turso db show scopewise --url`
- Get token: `turso db tokens create scopewise`
- Set `TURSO_DB_URL` and `TURSO_DB_AUTH_TOKEN`

### 3. Google OAuth (Required for Google sign-in)
- Go to [console.cloud.google.com](https://console.cloud.google.com)
- Create a project → APIs & Services → Credentials → Create OAuth 2.0 Client
- Add authorized redirect URI: `https://yourdomain.com/login/google/callback`
- Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### 4. Postmark (Required for magic link email)
- Sign up at [postmarkapp.com](https://postmarkapp.com)
- Create a server → get Server API Token
- Set `POSTMARK_SERVER_TOKEN` and `FROM_EMAIL`

### 5. Stripe (Required for payments)
- Sign up at [stripe.com](https://stripe.com)
- Create two recurring products in Stripe Dashboard:
  - **Starter**: $19/month recurring → copy Price ID
  - **Pro**: $39/month recurring → copy Price ID
- Set `STRIPE_SECRET_KEY`, `STRIPE_SECRET_KEY_TEST`
- Set `STRIPE_STARTER_PRICE_ID` and `STRIPE_PRO_PRICE_ID`
- Set up webhook (see below) → set `STRIPE_WEBHOOK_SECRET`

### 6. Public Variables
```bash
PUBLIC_PROJECT_NAME=ScopeWise
PUBLIC_ORIGIN=https://yourdomain.com
PUBLIC_DEFAULT_TITLE=ScopeWise – AI Proposal Generator for Freelancers
PUBLIC_DEFAULT_DESCRIPTION=Turn project briefs into professional proposals in 60 seconds.
PUBLIC_POSTHOG_KEY=phc_... # optional, for analytics
```

---

## Production Deployment (Vercel)

### 1. Deploy to Vercel

```bash
npm install -g vercel
vercel deploy --prod
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deployments.

### 2. Run production migrations

```bash
npm run migrate:prod
```

### 3. Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Copy the webhook signing secret → set as `STRIPE_WEBHOOK_SECRET`

### 4. Add Environment Variables in Vercel

Go to Vercel project → Settings → Environment Variables and add all variables from `.env`.

---

## Pricing Setup in Stripe Dashboard

Create these products (recurring monthly):

| Product | Price | Description |
|---------|-------|-------------|
| ScopeWise Starter | $19.00/mo | 20 proposals per month |
| ScopeWise Pro | $39.00/mo | Unlimited proposals |

Copy the Price IDs (starting with `price_`) to your env file.

---

## Database Schema

```
users           — email, name, stripe_customer_id
sessions        — lucia auth sessions
subscriptions   — plan (free/starter/pro), usage tracking, Stripe IDs
proposals       — user's proposals with AI-generated content (JSON)
```

Run migrations:
```bash
npm run generate    # generate SQL from schema changes
npm run migrate     # apply to local SQLite
npm run migrate:prod # apply to production Turso DB
```

---

## Go-to-Market Strategy

### Channel 1: Reddit (r/freelance, r/webdev, r/Upwork)
Post honest founder stories about the proposal problem. Don't sell — share the frustration, link to the product naturally. Target threads where people complain about writing proposals.

**Example post**: "I spent 6 hours writing a proposal for a $4k project. I built a tool to fix this."

### Channel 2: Cold Outreach on LinkedIn/Upwork
Target freelancers with 50+ reviews who are actively taking projects. Message:
> "Hey [Name] — I noticed you do [project type] work on [platform]. I built a tool that generates complete project proposals in 60 seconds using AI. Free to try. Would love feedback from an experienced freelancer."

### Channel 3: Indie Hacker & Product Hunt Launch
Post on IndieHackers.com with a full build log. Launch on Product Hunt for initial burst of signups. The viral loop: every proposal sent to a client has "Created with ScopeWise" branding in the footer.

### Launch Checklist

**Domain & Hosting**
- [ ] Register `scopewise.app` or similar (Namecheap/Cloudflare ~$12/year)
- [ ] Deploy to Vercel (free tier)
- [ ] Configure custom domain in Vercel

**Payments**
- [ ] Create Stripe products (Starter $19/mo, Pro $39/mo)
- [ ] Configure Stripe webhook
- [ ] Test checkout flow end-to-end

**Services**
- [ ] Create Turso DB + run migrations
- [ ] Set up Postmark + verify sender domain
- [ ] Get Anthropic API key (add $20 credit)
- [ ] Set up Google OAuth credentials

**Analytics & Monitoring**
- [ ] Set up PostHog (free tier)
- [ ] Enable Vercel Analytics
- [ ] Set up Sentry for error monitoring (free tier)

**Legal Minimum**
- [ ] Privacy policy (included at /privacy-policy)
- [ ] Terms of use (included at /terms-of-use)

**Pre-launch**
- [ ] Test full flow: sign up → create proposal → AI generation → share link → print PDF
- [ ] Test Stripe checkout → webhook → subscription activation
- [ ] Send 5 test proposals to verify AI quality

---

## Architecture Notes

- **AI generation** is synchronous (not streaming) — Claude generates the full proposal, it's validated as JSON, saved to DB, and returned to the client. P95 latency is ~20-30s.
- **Proposal content** is stored as JSON string in SQLite — no separate section tables needed for v1.
- **Share links** use random 24-char tokens, not sequential IDs, to prevent enumeration.
- **PDF export** uses browser `window.print()` — no server-side PDF generation needed.
- **Subscription usage** resets on each new billing period (tracked via Stripe webhook).

---

## Revenue Projections

| Scenario | Customers | MRR |
|----------|-----------|-----|
| Conservative | 10 Pro + 20 Starter | $770/mo |
| Mid | 30 Pro + 60 Starter | $2,310/mo |
| Optimistic | 100 Pro + 150 Starter | $6,750/mo |

At 100 Pro customers: ~$6,750 MRR, ~$75K ARR. Infrastructure cost <$50/month.

---

## License

MIT
