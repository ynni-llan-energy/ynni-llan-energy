"use client";

import { useActionState } from "react";
import { signUp, signInWithGoogle } from "@/app/actions/auth";
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
    <div className="space-y-6">
      {/* Google OAuth */}
      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-sm border border-[#0A4B68]/20 bg-white text-[#0A4B68] text-sm font-medium hover:bg-[#0A4B68]/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68]"
        >
          <GoogleIcon />
          <span lang="cy">Ymuno gyda Google</span>
          <span className="opacity-50 text-xs italic" lang="en">/ Join with Google</span>
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#0A4B68]/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#EEE8D8] px-3 text-[#0A4B68]/50 italic">
            neu / or
          </span>
        </div>
      </div>

      {/* Email/password form */}
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

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#0A4B68] mb-1"
          >
            <span lang="cy">Cyfrinair</span>{" "}
            <span className="opacity-60 italic text-xs" lang="en">Password</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full px-3 py-2.5 rounded-sm border border-[#0A4B68]/20 bg-white text-[#0A4B68] placeholder-[#0A4B68]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4B68]/30 focus:border-[#0A4B68]"
            placeholder="O leiaf 8 cymeriad / At least 8 characters"
          />
          <FieldError messages={state?.errors?.password} />
        </div>

        <Button type="submit" disabled={pending} className="w-full" size="md">
          {pending ? (
            <span lang="cy">Yn ymuno…</span>
          ) : (
            <>
              <span lang="cy">Creu cyfrif</span>
              <span className="opacity-60 italic text-xs" lang="en">/ Create account</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
