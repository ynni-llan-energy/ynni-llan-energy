"use client";

import { useActionState } from "react";
import { requestMagicLink } from "@/app/actions/auth";
import type { AuthFormState } from "@/lib/auth/schemas";
import { Button } from "@/components/ui/button";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <ul className="mt-1 space-y-0.5">
      {messages.map((m) => (
        <li key={m} className="text-xs text-red-600" role="alert">
          {m}
        </li>
      ))}
    </ul>
  );
}

export function LoginForm({ callbackError }: { callbackError?: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    requestMagicLink,
    undefined
  );

  const errorMessage = callbackError === "auth_callback_failed"
    ? "Methwyd mewngofnodi / Sign-in failed. Please try again."
    : undefined;

  if (state?.message === "sent") {
    return (
      <div className="text-center py-4 space-y-3" role="status">
        <div className="text-4xl" aria-hidden>✉️</div>
        <p className="text-sm font-medium text-[#0A4B68]" lang="cy">
          Gwiriwch eich e-bost
        </p>
        <p className="text-xs italic text-[#0A4B68]/60" lang="en">
          Check your email — we've sent you a sign-in link.
        </p>
        <p className="text-xs text-[#0A4B68]/50 mt-2">
          <span lang="cy">Mae'r ddolen yn ddilys am awr.</span>{" "}
          <span className="italic" lang="en">The link is valid for one hour.</span>
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {(state?.message || errorMessage) && (
        <div
          className="p-3 rounded-sm bg-red-50 border border-red-200 text-sm text-red-700"
          role="alert"
        >
          {errorMessage ?? state?.message}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#0A4B68] mb-1"
        >
          <span lang="cy">E-bost</span>{" "}
          <span className="opacity-60 italic text-xs" lang="en">Email</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full px-3 py-2.5 rounded-sm border border-[#0A4B68]/20 bg-white text-[#0A4B68] placeholder-[#0A4B68]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4B68]/30 focus:border-[#0A4B68]"
          placeholder="chi@enghraifft.com"
        />
        <FieldError messages={state?.errors?.email} />
      </div>

      <Button type="submit" disabled={pending} className="w-full" size="md">
        {pending ? (
          <span lang="cy">Yn anfon…</span>
        ) : (
          <>
            <span lang="cy">Anfon dolen mewngofnodi</span>
            <span className="opacity-60 italic text-xs" lang="en">/ Send sign-in link</span>
          </>
        )}
      </Button>
    </form>
  );
}
