# AI app with credits (Next.js)

A Next.js App Router starter that charges credits per AI generation with
[Cred](https://cred.diy): an atomic deduct as the balance check, idempotent retries,
automatic refunds when generation fails, and Stripe checkout to buy more.

The step-by-step guide is at
[How to add a credit system to a Next.js AI app](https://cred.diy/blog/nextjs-ai-app-credit-system).

## Run it

1. Create a project at [cred.diy](https://cred.diy/auth) with one credit type and an API key.
2. `cp .env.example .env.local` and fill in the values.
3. `npm install && npm run dev`

The first generation grants 50 starter credits, then each one costs 5.

## Before you deploy

- Replace `lib/auth.ts` with your auth library. The demo user refuses to run in production.
- Replace `lib/model.ts` with your model call.
- Move `grantSignupCredits` from the route into your sign-up flow.
- Add your domain under Dashboard → Payments → Allowed redirect domains, or buyers land on Cred's default page after checkout instead of your app.
- Keep `CRED_API_KEY` server-only; never prefix it with `NEXT_PUBLIC_`.
