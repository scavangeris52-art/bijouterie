import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { items, shippingCost, locale = "fr" } = await req.json();

    const lineItems = items.map((item: { name: string; price: number; quantity: number; image?: string }) => ({
      price_data: {
        currency:     "mad",
        unit_amount:  Math.round(item.price * 100),
        product_data: {
          name:   item.name,
          images: item.image ? [item.image] : [],
        },
      },
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency:     "mad",
          unit_amount:  Math.round(shippingCost * 100),
          product_data: { name: "Frais de livraison" },
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items:  lineItems,
      mode:        "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/checkout`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
