import { NextResponse } from "next/server";
import { getVapidKeys } from "@/lib/push/vapid";

export async function GET() {
  const { publicKeyBase64Url } = getVapidKeys();
  return NextResponse.json({ publicKey: publicKeyBase64Url });
}
