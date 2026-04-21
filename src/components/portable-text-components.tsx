import type { PortableTextComponents } from "@portabletext/react";

export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-2xl font-bold text-[#0A4B68] mt-8 mb-3 not-italic">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-xl font-semibold text-[#0A4B68] mt-6 mb-2 not-italic">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-display text-lg font-semibold text-[#0A4B68] mt-4 mb-2 not-italic">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#C07E00] pl-4 italic my-4">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="font-mono text-sm bg-black/10 px-1 rounded">{children}</code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="text-[#C07E00] underline underline-offset-2 hover:text-[#0A4B68] transition-colors not-italic"
        {...(value?.blank ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  hardBreak: () => <br />,
};
