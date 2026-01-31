import Stripe from "stripe";
import paymentModel from "../models/paymentModel";
import { WebhookAdapter } from "./ProviderAdapter";

export class StripeWebhookAdapter implements WebhookAdapter {

    verifyWebhook(req: any, secret: any) {
        const webhookBody = req.body;
        const webhookSignature = req.headers["stripe-signature"] as string;
        const webhookSecret = secret as string;

        let event: Stripe.Event;
        try {
            event = Stripe.webhooks.constructEvent(webhookBody, webhookSignature, webhookSecret);
        } catch (err) {
            console.log("Stripe signature validation failed!");
            throw new Error(`Invalid Stripe webhook signature: ${(err as Error).message}`);
        }

        console.log("Stripe signature validation successful!");
        return event;
    }

    async normalizeWebhook(event: Stripe.Event) {
        console.log("Stripe event received:", event.type);

        if (!event.type.startsWith("payment_intent.")) {
            console.log("Ignoring non payment_intent event");
            return;
        }

        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        if (!paymentIntent.metadata?.order_id) {
            console.warn("order_id missing in metadata");
            return;
        }

        let status: "ATTEMPTED" | "CREATED" | "CAPTURED" | "FAILED" = "ATTEMPTED";

        switch (event.type) {
            case "payment_intent.succeeded":
                status = "CAPTURED";
                break;
            case "payment_intent.payment_failed":
                status = "FAILED";
                break;
            default:
                console.log("Unhandled event:", event.type);
        }

        await paymentModel.findOneAndUpdate(
            { orderId: paymentIntent.metadata.order_id },
            {
                paymentId: paymentIntent.id,
                status,
                amount: paymentIntent.amount_received,
                raw: event,
            }
        );

        console.log("Payment updated:", status);

        return {
            provider: "stripe",
            orderId: paymentIntent.metadata.order_id,
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount_received,
            currency: paymentIntent.currency,
            status,
        };

    }
}
