import "server-only"; // the build fails if a client component imports this

export const CRED_BASE = "https://eutdgemlrpvnxfkkpvlu.supabase.co/functions/v1";

export async function cred(path: string, init: RequestInit = {}) {
  const res = await fetch(`${CRED_BASE}/credits-api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CRED_API_KEY!,
      ...init.headers,
    },
    cache: "no-store", // balances must never come from the Next.js data cache
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

/** Safe to call on every sign-in: the fixed key means only the first call adds credits. */
export async function grantSignupCredits(user: { id: string; email: string }) {
  return cred("/issue", {
    method: "POST",
    headers: { "Idempotency-Key": `signup-grant:${user.id}` },
    body: JSON.stringify({
      user_id: user.id,
      user_email: user.email.toLowerCase(),
      credit_type_id: process.env.CRED_CREDIT_TYPE_ID,
      amount: 50,
      reason: "Signup bonus",
    }),
  });
}
