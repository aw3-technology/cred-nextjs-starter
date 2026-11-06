import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { cred, grantSignupCredits } from "@/lib/cred";
import { generate } from "@/lib/model";

const COST = 5; // credits per generation, decided on the server

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in first" }, { status: 401 });

  const { prompt, requestId } = await req.json();
  if (typeof requestId !== "string" || !requestId) {
    return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  }

  // In a real app, call this from your sign-up flow instead of on every request.
  await grantSignupCredits(user);

  // The deduct is the balance check: it fails rather than going negative.
  const charge = await cred("/deduct", {
    method: "POST",
    headers: { "Idempotency-Key": `gen:${user.id}:${requestId}` },
    body: JSON.stringify({
      user_id: user.id,
      user_email: user.email.toLowerCase(),
      credit_type_id: process.env.CRED_CREDIT_TYPE_ID,
      amount: COST,
      reason: "Generation",
      reference_id: requestId,
    }),
  });

  if (charge.body.code === "INSUFFICIENT_CREDITS" || charge.body.code === "USER_NOT_FOUND") {
    return NextResponse.json({ error: "Not enough credits", cost: COST }, { status: 402 });
  }
  if (charge.status !== 200) {
    return NextResponse.json({ error: "Billing is unavailable, try again" }, { status: 503 });
  }
  // A retry of a request already charged: don't run (and give away) the work again.
  if (charge.body.idempotent_replay) {
    return NextResponse.json({ error: "This request was already processed" }, { status: 409 });
  }

  try {
    const result = await generate(prompt);
    return NextResponse.json({ result, balance: charge.body.new_balance });
  } catch {
    await cred("/refund", {
      method: "POST",
      body: JSON.stringify({
        transaction_id: charge.body.transaction_id,
        reason: "Generation failed",
      }),
    });
    return NextResponse.json({ error: "Generation failed; credits returned" }, { status: 500 });
  }
}
