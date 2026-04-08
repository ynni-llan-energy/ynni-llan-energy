/**
 * BilingualText — Welsh primary, English secondary.
 *
 * Welsh text is always rendered first in the DOM, at full size.
 * English follows in italic at a slightly smaller size, separated
 * by the gold left-border treatment from the Tonnau design system.
 */

interface BilingualTextProps {
  cy: string;
  en: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  cyClassName?: string;
  enClassName?: string;
  className?: string;
  /** If true, renders Welsh and English stacked; if false (default) inline */
  stacked?: boolean;
}

export function BilingualText({
  cy,
  en,
  as: Tag = "p",
  cyClassName = "",
  enClassName = "",
  className = "",
  stacked = true,
}: BilingualTextProps) {
  if (stacked) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <Tag lang="cy" className={`cy ${cyClassName}`}>
          {cy}
        </Tag>
        <span
          lang="en"
          className={`en block pl-3 border-l-2 border-[#C07E00] ${enClassName}`}
        >
          {en}
        </span>
      </div>
    );
  }

  return (
    <Tag lang="cy" className={`cy ${className} ${cyClassName}`}>
      {cy}{" "}
      <span lang="en" className={`en ${enClassName}`}>
        / {en}
      </span>
    </Tag>
  );
}
