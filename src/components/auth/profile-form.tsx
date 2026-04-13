"use client";

import { useState, useActionState } from "react";
import { updateProfile } from "@/app/actions/auth";
import type { AuthFormState } from "@/lib/auth/schemas";

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
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  // Track optimistically-displayed values separately so view mode updates
  // immediately on save without a page refresh.
  const [displayValues, setDisplayValues] = useState({
    full_name: defaultValues.full_name,
    postcode: defaultValues.postcode,
  });

  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    async (prev, formData) => {
      const result = await updateProfile(prev, formData);
      if (result?.message === "success") {
        // Capture the new values to show in view mode
        setDisplayValues({
          full_name: (formData.get("full_name") as string) || null,
          postcode: (formData.get("postcode") as string) || null,
        });
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 4000);
      }
      return result;
    },
    undefined
  );

  return (
    <section
      className="bg-white/60 border border-[#0A4B68]/10 rounded-sm overflow-hidden"
      aria-labelledby="profile-heading"
    >
      {/* ── Section header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#0A4B68]/10">
        <h2
          id="profile-heading"
          className="font-display text-lg font-bold text-[#0A4B68]"
          lang="cy"
        >
          Fy Manylion
          <span
            className="ml-2 font-sans font-normal italic text-sm text-[#0A4B68]/60"
            lang="en"
          >
            / My Details
          </span>
        </h2>

        {!editing && (
          <button
            type="button"
            onClick={() => { setEditing(true); setSaved(false); }}
            className="flex items-center gap-1.5 text-sm text-[#0A4B68]/60 hover:text-[#0A4B68] transition-colors"
            aria-label="Golygu manylion / Edit details"
          >
            <PencilIcon />
            <span lang="cy" className="text-xs font-medium">Golygu</span>
            <span lang="en" className="text-xs italic opacity-70">/ Edit</span>
          </button>
        )}
      </div>

      {/* ── Saved confirmation ───────────────────────────────────── */}
      {saved && (
        <div
          className="mx-6 mt-4 p-3 rounded-sm bg-green-50 border border-green-200 text-sm text-green-700"
          role="status"
        >
          <span lang="cy">Wedi ei gadw!</span>{" "}
          <span className="italic opacity-70" lang="en">Saved!</span>
        </div>
      )}

      {/* ── View mode ────────────────────────────────────────────── */}
      {!editing && (
        <div className="px-6 py-5 space-y-5">
          <Field
            labelCy="Enw llawn"
            labelEn="Full name"
            value={displayValues.full_name}
            emptyHint="—"
          />
          <Field
            labelCy="Cod post"
            labelEn="Postcode"
            value={displayValues.postcode}
            emptyHint="—"
            mono
          />
        </div>
      )}

      {/* ── Edit mode ────────────────────────────────────────────── */}
      {editing && (
        <form
          action={action}
          className="px-6 py-5 space-y-5"
          noValidate
        >
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
              className="block text-xs font-semibold text-[#0A4B68]/60 uppercase tracking-wide mb-1.5"
            >
              <span lang="cy">Enw llawn</span>{" "}
              <span className="normal-case not-italic font-normal" lang="en">/ Full name</span>
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              defaultValue={displayValues.full_name ?? ""}
              required
              autoFocus
              className="w-full px-3 py-2.5 rounded-sm border border-[#0A4B68]/20 bg-white text-[#0A4B68] text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4B68]/30 focus:border-[#0A4B68]"
            />
            <FieldError messages={state?.errors?.full_name} />
          </div>

          <div>
            <label
              htmlFor="postcode"
              className="block text-xs font-semibold text-[#0A4B68]/60 uppercase tracking-wide mb-1.5"
            >
              <span lang="cy">Cod post</span>{" "}
              <span className="normal-case not-italic font-normal" lang="en">/ Postcode</span>
              <span className="ml-1 text-[#0A4B68]/40 font-normal normal-case not-italic">(dewisol / optional)</span>
            </label>
            <input
              id="postcode"
              name="postcode"
              type="text"
              autoComplete="postal-code"
              defaultValue={displayValues.postcode ?? ""}
              className="w-full px-3 py-2.5 rounded-sm border border-[#0A4B68]/20 bg-white text-[#0A4B68] text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4B68]/30 focus:border-[#0A4B68] uppercase"
              placeholder="LL33"
            />
            <FieldError messages={state?.errors?.postcode} />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={pending}
              className="px-4 py-2 rounded-sm bg-[#0A4B68] text-[#EEE8D8] text-sm font-medium hover:bg-[#083a52] disabled:opacity-50 transition-colors"
            >
              {pending ? (
                <span lang="cy">Yn cadw…</span>
              ) : (
                <>
                  <span lang="cy">Cadw</span>
                  <span className="opacity-60 italic text-xs" lang="en"> / Save</span>
                </>
              )}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => { setEditing(false); }}
              className="px-4 py-2 rounded-sm border border-[#0A4B68]/20 text-[#0A4B68] text-sm hover:bg-[#0A4B68]/5 disabled:opacity-50 transition-colors"
            >
              <span lang="cy">Canslo</span>
              <span className="opacity-60 italic text-xs" lang="en"> / Cancel</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

// ─── View field ───────────────────────────────────────────────────────────────

function Field({
  labelCy,
  labelEn,
  value,
  emptyHint,
  mono = false,
}: {
  labelCy: string;
  labelEn: string;
  value: string | null;
  emptyHint: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#0A4B68]/50 uppercase tracking-wide mb-1">
        <span lang="cy">{labelCy}</span>{" "}
        <span className="normal-case not-italic font-normal" lang="en">/ {labelEn}</span>
      </p>
      <p
        className={`text-[#0A4B68] text-base ${
          mono ? "font-mono uppercase tracking-wider" : ""
        } ${!value ? "italic text-[#0A4B68]/30" : ""}`}
      >
        {value || emptyHint}
      </p>
    </div>
  );
}

// ─── Icon ─────────────────────────────────────────────────────────────────────

function PencilIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
