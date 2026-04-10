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
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Studio not configured</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and the other{" "}
          <code>NEXT_PUBLIC_SANITY_*</code> vars) in your Vercel project
          settings for the Preview environment, then redeploy.
        </p>
      </div>
    );
  }
  return <NextStudio config={config} />;
}
