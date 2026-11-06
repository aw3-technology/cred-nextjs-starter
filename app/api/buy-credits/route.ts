import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { CRED_BASE } from "@/lib/cred";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in first" }, { status: 401 });

  const res = await fetch(`${CRED_BASE}/hosted-checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.CRED_API_KEY! },
    body: JSON.stringify({
      user_id: user.id,
      user_email: user.email.toLowerCase(),
      pricing_tier_id: process.env.CRED_PRICING_TIER_ID,
      success_url: `${process.env.APP_URL}/?status=success`,
      cancel_url: `${process.env.APP_URL}/`,
    }),
  });
  const { url, error } = await res.json();
  if (!url) return NextResponse.json({ error }, { status: 502 });
  // Cred's Stripe webhook adds the credits after payment; the success page must not.
  return NextResponse.json({ url });
}
