"use client";

import { useActionState } from "react";
import { submitRoleInterest } from "@/app/actions/volunteer";
import type { VolunteerFormState } from "@/app/actions/volunteer";

interface InterestFormProps {
  roleSlug: string;
  roleTitle: string;
  isAuthenticated: boolean;
}

export function InterestForm({ roleSlug, roleTitle, isAuthenticated }: InterestFormProps) {
  const [state, action, pending] = useActionState<VolunteerFormState, FormData>(
    submitRoleInterest,
    undefined
  );

  if (!isAuthenticated) {
    return (
      <div className="mt-10 p-6 rounded-sm bg-[#EEE8D8] border border-[#0A4B68]/10">
        <p className="text-sm text-[#0A4B68]/80" lang="cy">
          Mae angen i chi fod yn aelod i fynegi diddordeb.{" "}
          <a href="/ymuno" className="text-[#C07E00] underline underline-offset-2 hover:text-[#0A4B68] transition-colors font-medium">
            Ymunwch heddiw
          </a>
          {" "}neu{" "}
          <a href="/mewngofnodi" className="text-[#C07E00] underline underline-offset-2 hover:text-[#0A4B68] transition-colors font-medium">
            mewngofnodwch
          </a>
          .
        </p>
        <p className="text-xs italic text-[#0A4B68]/50 mt-2" lang="en">
          You need to be a member to express interest.{" "}
          <a href="/ymuno" className="underline underline-offset-2 hover:text-[#C07E00] transition-colors">
            Join today
          </a>
          {" "}or{" "}
          <a href="/mewngofnodi" className="underline underline-offset-2 hover:text-[#C07E00] transition-colors">
            log in
          </a>
          .
        </p>
      </div>
    );
  }

  if (state?.message === "success") {
    return (
      <div className="mt-10 p-6 rounded-sm bg-[#2B8050]/10 border border-[#2B8050]/30" role="status">
        <div className="flex gap-3 items-start">
          <span className="text-[#2B8050] text-xl" aria-hidden>✓</span>
          <div>
            <p className="text-sm font-medium text-[#0A4B68]" lang="cy">
              Diolch am fynegi diddordeb! Byddwn yn cysylltu â chi cyn bo hir.
            </p>
            <p className="text-xs italic text-[#0A4B68]/60 mt-1" lang="en">
              Thank you for expressing interest! We will be in touch shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state?.message === "already_submitted") {
    return (
      <div className="mt-10 p-6 rounded-sm bg-[#E09800]/10 border border-[#E09800]/30" role="status">
        <div className="flex gap-3 items-start">
          <span className="text-[#E09800] text-xl" aria-hidden>ℹ</span>
          <div>
            <p className="text-sm font-medium text-[#0A4B68]" lang="cy">
              Rydych eisoes wedi mynegi diddordeb yn y rôl hon.
            </p>
            <p className="text-xs italic text-[#0A4B68]/60 mt-1" lang="en">
              You have already expressed interest in this role.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 p-6 rounded-sm bg-[#EEE8D8] border border-[#0A4B68]/10">
      <h3 className="font-display text-lg font-bold text-[#0A4B68] mb-1" lang="cy">
        Hoffwn i helpu
      </h3>
      <p className="text-xs italic text-[#0A4B68]/50 mb-5" lang="en">
        I&apos;d like to help
      </p>

      {state?.message && state.message !== "success" && state.message !== "already_submitted" && (
        <div className="mb-4 p-3 rounded-sm bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
          {state.message}
        </div>
      )}

      <form action={action} className="space-y-4" noValidate>
        <input type="hidden" name="role_slug" value={roleSlug} />
        <input type="hidden" name="role_title" value={roleTitle} />

        <div>
          <label
            htmlFor="statement"
            className="block text-sm font-medium text-[#0A4B68] mb-1"
          >
            <span lang="cy">Datganiad o ddiddordeb</span>{" "}
            <span className="text-xs italic text-[#0A4B68]/50" lang="en">Statement of interest</span>
            <span className="ml-1 text-[#0A4B68]/40 text-xs">(dewisol / optional)</span>
          </label>
          <textarea
            id="statement"
            name="statement"
            rows={4}
            maxLength={1000}
            placeholder="Dywedwch ychydig amdanoch chi'ch hun a pham y mae gennych ddiddordeb yn y rôl hon… / Tell us a little about yourself and why you're interested in this role…"
            className="w-full px-3 py-2.5 rounded-sm border border-[#0A4B68]/20 bg-white text-[#0A4B68] placeholder-[#0A4B68]/30 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0A4B68]/30 focus:border-[#0A4B68] resize-y"
          />
          {state?.errors?.statement && (
            <ul className="mt-1 space-y-0.5">
              {state.errors.statement.map((m) => (
                <li key={m} className="text-xs text-red-600" role="alert">{m}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[#0A4B68] text-[#EEE8D8] text-sm font-medium hover:bg-[#083a52] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? (
            <span lang="cy">Yn cyflwyno…</span>
          ) : (
            <>
              <span lang="cy">Hoffwn i helpu</span>
              <span className="opacity-60 italic text-xs" lang="en">/ I&apos;d like to help</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
