/**
 * DraftModeBanner — visible indicator shown when Next.js Draft Mode is active.
 * Appears at the top of every page so editors know they're seeing unpublished content.
 * Includes a link to disable draft mode and return to the live site.
 */
export function DraftModeBanner() {
  return (
    <div
      role="alert"
      className="sticky top-0 z-[100] flex items-center justify-between gap-4 bg-[#E09800] text-[#0A4B68] px-4 py-2 text-sm font-medium"
    >
      <div className="flex items-center gap-2">
        {/* Pulsing dot */}
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A4B68] opacity-50" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0A4B68]" />
        </span>
        <span lang="cy">Modd drafft</span>
        <span className="opacity-60 italic font-normal" lang="en">/ Draft preview — unpublished content visible</span>
      </div>

      <a
        href="/api/draft-mode/disable"
        className="underline underline-offset-2 hover:opacity-75 transition-opacity whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68]"
      >
        <span lang="cy">Gadael</span>
        <span className="opacity-60 italic font-normal ml-1" lang="en">/ Exit preview</span>
      </a>
    </div>
  );
}
