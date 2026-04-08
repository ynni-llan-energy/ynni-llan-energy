/**
 * Embedded Sanity Studio at /studio
 *
 * Rendered entirely client-side — Sanity Studio is a React SPA
 * and cannot be server-rendered. Access is controlled via Sanity
 * project member permissions at sanity.io/manage.
 */

"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
