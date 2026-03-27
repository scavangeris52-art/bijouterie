export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendNewsletterConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, locale = "fr" } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    // Save/update subscriber
    const isNewSubscriber = !(await prisma.subscriber.findUnique({
      where: { email },
    }));

    await prisma.subscriber.upsert({
      where:  { email },
      update: { active: true },
      create: { email, locale },
    });

    // Send confirmation email only for new subscribers
    if (isNewSubscriber) {
      await sendNewsletterConfirmationEmail(email, locale);
    }

    return NextResponse.json({ message: "Subscribed!" });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
