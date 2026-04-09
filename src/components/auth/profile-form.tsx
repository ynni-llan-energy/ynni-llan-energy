"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/auth";
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

interface ProfileFormProps {
  defaultValues: {
    full_name: string | null;
    postcode: string | null;
  };
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    updateProfile,
    undefined
  );

  const saved = state?.message === "success";

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

      {saved && (
        <div
          className="p-3 rounded-sm bg-green-50 border border-green-200 text-sm text-green-700"
          role="status"
        >
          <span lang="cy">Wedi ei gadw!</span>{" "}
          <span className="italic opacity-70" lang="en">Saved!</span>
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
          defaultValue={defaultValues.full_name ?? ""}
          required
          className="w-full px-3 py-2.5 rounded-sm border border-[#0A4B68]/20 bg-white text-[#0A4B68] placeholder-[#0A4B68]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4B68]/30 focus:border-[#0A4B68]"
        />
        <FieldError messages={state?.errors?.full_name} />
      </div>

      <div>
        <label
          htmlFor="postcode"
          className="block text-sm font-medium text-[#0A4B68] mb-1"
        >
          <span lang="cy">Cod post</span>{" "}
          <span className="opacity-60 italic text-xs" lang="en">Postcode</span>
          <span className="ml-1 text-[#0A4B68]/40 text-xs">(dewisol / optional)</span>
        </label>
        <input
          id="postcode"
          name="postcode"
          type="text"
          autoComplete="postal-code"
          defaultValue={defaultValues.postcode ?? ""}
          className="w-full px-3 py-2.5 rounded-sm border border-[#0A4B68]/20 bg-white text-[#0A4B68] placeholder-[#0A4B68]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4B68]/30 focus:border-[#0A4B68] uppercase"
          placeholder="LL33"
        />
        <FieldError messages={state?.errors?.postcode} />
      </div>

      <Button type="submit" disabled={pending} size="md">
        {pending ? (
          <span lang="cy">Yn cadw…</span>
        ) : (
          <>
            <span lang="cy">Cadw newidiadau</span>
            <span className="opacity-60 italic text-xs" lang="en">/ Save changes</span>
          </>
        )}
      </Button>
    </form>
  );
}
