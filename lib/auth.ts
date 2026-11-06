import "server-only";

/**
 * REPLACE THIS with your auth library (Auth.js, Clerk, Supabase Auth). It returns
 * one fixed demo user, so it refuses to run in production: every visitor would
 * otherwise share a wallet.
 */
export async function getCurrentUser() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Replace the demo user in lib/auth.ts before deploying");
  }
  return { id: "demo-user", email: "demo@example.com" };
}
