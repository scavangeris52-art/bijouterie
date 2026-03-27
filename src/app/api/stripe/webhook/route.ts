export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Stripe Webhook Handler
 * Handles payment_intent.succeeded and payment_intent.payment_failed events
 * Updates order status based on payment status
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!webhookSecret || !signature) {
      return NextResponse.json(
        { error: "Missing webhook secret or signature" },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      ) as Stripe.Event;
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle specific event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      default:
        // Silently ignore other event types
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle checkout session completion
 * Update order status to CONFIRMED when payment is successful
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    // Get the session ID from client_reference_id or metadata
    const sessionId = session.id;
    const clientRefId = session.client_reference_id;

    if (!clientRefId) {
      console.warn("No client_reference_id in checkout session:", sessionId);
      return;
    }

    // Update the order to mark it as paid
    const order = await prisma.order.update({
      where: { id: clientRefId },
      data: {
        status: "CONFIRMED",
        paymentId: session.payment_intent as string,
        paidAt: new Date(),
      },
    });

    console.log("Order confirmed:", order.orderNumber);

    // Here you could also send a confirmation email
    // await sendOrderConfirmationEmail(order);
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
  }
}

/**
 * Handle payment intent succeeded
 * Update order status if needed
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find order by payment ID
    const order = await prisma.order.findFirst({
      where: { paymentId: paymentIntent.id },
    });

    if (!order) {
      console.warn("No order found for payment:", paymentIntent.id);
      return;
    }

    // Update order status if not already confirmed
    if (order.status === "PENDING") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "CONFIRMED",
          paidAt: new Date(),
        },
      });
      console.log("Order status updated to CONFIRMED:", order.orderNumber);
    }
  } catch (error) {
    console.error("Error handling payment intent succeeded:", error);
  }
}

/**
 * Handle payment intent failed
 * Keep order as PENDING or mark as CANCELLED
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find order by payment ID
    const order = await prisma.order.findFirst({
      where: { paymentId: paymentIntent.id },
    });

    if (!order) {
      console.warn("No order found for failed payment:", paymentIntent.id);
      return;
    }

    console.warn("Payment failed for order:", order.orderNumber);
    // Order remains PENDING - customer can retry
  } catch (error) {
    console.error("Error handling payment intent failed:", error);
  }
}

/**
 * Handle charge refunded
 * Update order status to REFUNDED
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    if (!charge.payment_intent) {
      console.warn("No payment_intent in charge:", charge.id);
      return;
    }

    const order = await prisma.order.findFirst({
      where: { paymentId: charge.payment_intent as string },
    });

    if (!order) {
      console.warn("No order found for refunded charge:", charge.id);
      return;
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "REFUNDED" },
    });

    console.log("Order refunded:", order.orderNumber);
  } catch (error) {
    console.error("Error handling charge refunded:", error);
  }
}
