"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [outOfCredits, setOutOfCredits] = useState(false);

  async function run() {
    // One id per click; reuse it only to retry that same click.
    const requestId = crypto.randomUUID();
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, requestId }),
    });
    const body = await res.json();
    setOutOfCredits(res.status === 402);
    if (res.ok) setBalance(body.balance);
    setResult(res.ok ? body.result : body.error);
  }

  async function buy() {
    const res = await fetch("/api/buy-credits", { method: "POST" });
    const { url, error } = await res.json();
    if (url) window.location.href = url;
    else setResult(error ?? "Checkout is unavailable");
  }

  return (
    <main>
      <h1>AI app with credits</h1>
      <p>Each generation costs 5 credits.{balance !== null && ` Balance: ${balance}`}</p>
      <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Prompt" />
      <button onClick={run}>Generate</button>
      {outOfCredits && <button onClick={buy}>Buy credits</button>}
      <p>{result}</p>
    </main>
  );
}
