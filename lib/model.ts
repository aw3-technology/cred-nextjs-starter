import "server-only";

/** REPLACE THIS with your model call. Throw on failure and the route refunds the credits. */
export async function generate(prompt: string) {
  return `You asked for: ${prompt}`;
}
