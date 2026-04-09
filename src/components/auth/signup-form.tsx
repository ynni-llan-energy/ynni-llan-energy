"use client";

import { useActionState } from "react";
import { signUp } from "@/app/actions/auth";
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

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    signUp,
    undefined
  );

  return (
    <form action={action} className="space-y-5" noValidate>
      {state?.message && state.message !== "success" && (
        <div
          className="p-3 rounded-sm bg-red-50 border border-red-200 text-sm text-red-700"
          role="alert"
        >
          {state.message}
        </div>
      )}

      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-medium text-[#0A4B68] mb-1"
        >
          <span lang="cy">Enw llawn</span>{" "}
          <span className="opacity-60 italic text-xs" lang="en">Full name</span>
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
          className="w-full px-3 py-2.5 rounded-sm border border-[#0A4B68]/20 bg-white text-[#0A4B68] placeholder-[#0A4B68]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4B68]/30 focus:border-[#0A4B68]"
          placeholder="Enw llawn / Full name"
        />
        <FieldError messages={state?.errors?.full_name} />
      </div>

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
            <span lang="cy">Ymuno</span>
            <span className="opacity-60 italic text-xs" lang="en">/ Join</span>
          </>
        )}
      </Button>
    </form>
  );
}
