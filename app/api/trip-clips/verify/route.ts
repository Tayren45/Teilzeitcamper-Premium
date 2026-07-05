import { NextRequest, NextResponse } from "next/server";
import { verifyAccessCode } from "@/lib/trip-clips-db";

export async function POST(req: NextRequest) {
  let code = "";
  try {
    const body = await req.json();
    code = String(body.code || "");
  } catch {
    return NextResponse.json({ valid: false });
  }
  const valid = await verifyAccessCode(code);
  return NextResponse.json({ valid });
}
