"use client";

import { useState } from "react";
import type { VerifyResult } from "@/lib/types";

type State = { kind: "idle" } | { kind: "loading" } | { kind: "done"; result: VerifyResult };

export default function VerifyPanel() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function handleVerify() {
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/verify", { method: "POST" });
      const result: VerifyResult = await res.json();
      setState({ kind: "done", result });
    } catch (err) {
      setState({
        kind: "done",
        result: {
          status: "network_error",
          message: err instanceof Error ? err.message : "The verify request failed to complete.",
        },
      });
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleVerify}
        disabled={state.kind === "loading"}
        className="inline-flex items-center rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.kind === "loading" ? "Checking Polygon Amoy…" : "Verify on-chain"}
      </button>

      {state.kind === "done" && <ResultBanner result={state.result} />}
    </div>
  );
}

function ResultBanner({ result }: { result: VerifyResult }) {
  if (result.status === "verified" || result.status === "mismatch") {
    const ok = result.match;
    return (
      <div
        className={`rounded-md border px-4 py-3 text-sm ${
          ok ? "border-brand-100 bg-brand-50 text-brand-700" : "border-red-200 bg-red-50 text-red-800"
        }`}
      >
        <p className="font-medium">
          {ok ? "✓ Verified — matches the on-chain record" : "✕ Not verified — data does not match the anchored hash"}
        </p>
        <p className="mt-1 text-xs opacity-80">
          {ok
            ? "The record's freshly computed hash is identical to the hash stored in the anchoring transaction."
            : "The record's freshly computed hash differs from what was anchored. Treat this record as unreliable."}
        </p>
        <dl className="mt-3 space-y-1 font-mono text-xs">
          <div className="flex flex-wrap gap-x-2">
            <dt className="opacity-70">computed:</dt>
            <dd className="break-all">{result.computedHash}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="opacity-70">on-chain:</dt>
            <dd className="break-all">{result.onChainHash}</dd>
          </div>
        </dl>
      </div>
    );
  }

  // Verification could not be completed at all — kept visually distinct
  // from a mismatch, since an infrastructure failure is not a tamper finding.
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="font-medium">⚠ Could not complete verification</p>
      <p className="mt-1 text-xs opacity-80">{result.message}</p>
    </div>
  );
}
