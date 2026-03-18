export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, locale = "fr" } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await prisma.subscriber.upsert({
      where:  { email },
      update: { active: true },
      create: { email, locale },
    });

    return NextResponse.json({ message: "Subscribed!" });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
