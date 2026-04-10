import { flag } from "@vercel/flags/next";
import { get } from "@vercel/edge-config";

/**
 * Controls whether the full site is visible.
 *
 * Backed by Vercel Edge Config — set the key "whole-site" to true/false
 * per environment in the Vercel Flags dashboard.
 *
 * true  → site is open (normal operation)
 * false → WIP redirect is active (default when Edge Config is not set)
 */
export const wholeSiteFlag = flag<boolean>({
  key: "whole-site",
  defaultValue: false,
  description: "Enables the full site; when off all traffic sees the coming-soon page.",
  options: [
    { label: "Off (coming soon)", value: false },
    { label: "On (full site)", value: true },
  ],
  async decide() {
    if (!process.env.EDGE_CONFIG) return this.defaultValue!;
    return (await get<boolean>(this.key)) ?? this.defaultValue!;
  },
});
