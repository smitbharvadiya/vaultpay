import Stripe from "stripe";
import paymentModel from "../models/paymentModel";
import { WebhookAdapter } from "./ProviderAdapter";

export class StripeWebhookAdapter implements WebhookAdapter {


    verifyWebhook(req: any, secret: any) {

        const signature  = req.headers["stripe-signature"] as string;

        let event: Stripe.Event;
        try {
            event = Stripe.webhooks.constructEvent(req.body, signature, secret);
        } catch (err) {
            console.log("Stripe signature validation failed!");
            throw new Error(`Invalid Stripe webhook signature: ${(err as Error).message}`);
        }

        console.log("Stripe signature validation successful!");
        return event;
    }

    async normalizeWebhook(event: Stripe.Event) {
        console.log("Stripe event received:", event.type);


        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        let status:
            | "CREATED"
            | "ATTEMPTED"
            | "AUTHORIZED"
            | "CAPTURED"
            | "FAILED"
            = "ATTEMPTED";

        switch (event.type) {
            case "payment_intent.succeeded":
                status = "CAPTURED";
                await paymentModel.findOneAndUpdate(
                    { orderId: paymentIntent.metadata.order_id },
                    {
                        paymentId: paymentIntent.id,
                        status,
                        amount: paymentIntent.amount_received,
                        raw: event,
                    });
                console.log("Payment updated in DB!");
                break;

            case "payment_intent.payment_failed":
                status = "FAILED";
                await paymentModel.findOneAndUpdate(
                    { orderId: paymentIntent.metadata.order_id },
                    {
                        paymentId: paymentIntent.id,
                        status,
                        amount: paymentIntent.amount_received,
                        raw: event,
                    }
                );
                console.log("payment.failed saved");
                break;

            default:
                console.log("Unhandled event:", event.type);
        }

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
