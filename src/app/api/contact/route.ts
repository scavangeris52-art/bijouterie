export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContactConfirmationEmail } from "@/lib/email";
import { z } from "zod";

const contactSchema = z.object({
  name:    z.string().min(1),
  email:   z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = contactSchema.parse(body);

    // Save message to database
    await prisma.contactMessage.create({ data: parsed });

    // Send confirmation email to customer
    const locale = req.headers.get("x-locale") || "fr";
    await sendContactConfirmationEmail(parsed.email, parsed.name, parsed.subject, locale);

    return NextResponse.json({ message: "Message envoyé avec succès" }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 });
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
