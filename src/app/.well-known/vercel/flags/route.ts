import { verifyAccess, getProviderData } from "@vercel/flags";
import { wholeSiteFlag } from "../../../../flags";
import { NextResponse, type NextRequest } from "next/server";

// Vercel Toolbar uses this endpoint to discover flag definitions.
// Access is gated by FLAGS_SECRET.
export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get("Authorization"));
  if (!access) return NextResponse.json(null, { status: 401 });

  return NextResponse.json(
    getProviderData({ wholeSiteFlag })
  );
}
