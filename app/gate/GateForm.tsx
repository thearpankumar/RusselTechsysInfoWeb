"use client";

import * as React from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui-rt/Button";
import { Kbd } from "@/components/ui-rt/Kbd";
import { cn } from "@/lib/utils";

/** Passcode field (search-field style, kbd ↵ hint) + the one white button on the screen. */
export function GateForm({ next, initialError = false }: { next: string; initialError?: boolean }) {
  const [value, setValue] = React.useState("");
  const [state, setState] = React.useState<"idle" | "busy" | "error">(initialError ? "error" : "idle");
  const [message, setMessage] = React.useState(initialError ? "That passcode did not match." : "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: value }),
      });
      if (res.ok) {
        window.location.assign(next);
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setMessage(data.error ?? "That passcode did not match.");
      setState("error");
    } catch {
      setMessage("Could not reach the server. Try again.");
      setState("error");
    }
  };

  return (
    <form onSubmit={submit} method="post" action="/api/gate" className="mt-12 max-w-xl" noValidate>
      <input type="hidden" name="next" value={next} />
      <div className="flex flex-col gap-3 sm:flex-row">
      <label
        className={cn(
          "flex h-14 flex-none items-center gap-3 rounded-lg sm:flex-1 border bg-transparent px-4 transition-colors duration-150 focus-within:border-chart-mid",
          state === "error" ? "border-chart-mid" : "border-border"
        )}
      >
        <LockKeyhole className="size-5 shrink-0 text-muted" strokeWidth={1.5} />
        <span className="sr-only">Passcode</span>
        <input
          type="password"
          name="passcode"
          autoComplete="current-password"
          autoFocus
          placeholder="Passcode"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (state === "error") setState("idle");
          }}
          aria-invalid={state === "error"}
          aria-describedby="gate-message"
          className="h-full min-w-0 flex-1 bg-transparent t-body-lg text-on-surface outline-none focus-visible:outline-none"
        />
        <Kbd>↵</Kbd>
      </label>
      <Button type="submit" variant="primary" arrow disabled={state === "busy"} className="h-14">
        {state === "busy" ? "Checking" : "Enter"}
      </Button>
      </div>
      <p id="gate-message" role="status" aria-live="polite" className="mt-3 min-h-6 t-body-sm text-muted">
        {state === "error" ? message : ""}
      </p>
    </form>
  );
}
