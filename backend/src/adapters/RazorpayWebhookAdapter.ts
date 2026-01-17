import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import paymentModel from "../models/paymentModel";
import { WebhookAdapter } from "./ProviderAdapter";

export class RazorpayWebhookAdapter implements WebhookAdapter {

  verifyWebhook(req: any) {
        const webhookBody = req.body;
        const webhookSignature = req.get("X-Razorpay-Signature") as string;
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

        if (!validateWebhookSignature(JSON.stringify(webhookBody), webhookSignature, webhookSecret)) {
            console.log("Signature validation failed!");
            throw new Error("Invalid Razorpay webhook signature");
        }

        console.log("Signature validation successful!");
        return JSON.parse(JSON.stringify(webhookBody));
    }

    async normalizeWebhook(event: any) {
        console.log(event);
        console.log(event.payload.payment.entity);

        const payment = event.payload.payment.entity;
        let status:
            | "CREATED"
            | "ATTEMPTED"
            | "AUTHORIZED"
            | "CAPTURED"
            | "FAILED"
            = "ATTEMPTED";

        switch (event.event) {

            case "payment.authorized":
                status = "AUTHORIZED";
                await paymentModel.findOneAndUpdate(
                    { orderId: payment.order_id },
                    {
                        paymentId: payment.id,
                        status,
                        amount: payment.amount,
                        raw: event,
                    });
                console.log("Payment updated in DB!");
                break;

            case "payment.captured":
                status = "CAPTURED";
                await paymentModel.findOneAndUpdate(
                    { orderId: payment.order_id },
                    {
                        paymentId: payment.id,
                        status,
                        amount: payment.amount,
                        raw: event,
                    });
                console.log("Payment updated in DB!");
                break;

            case "payment.failed":
                status = "FAILED";
                await paymentModel.findOneAndUpdate(
                    { orderId: payment.order_id },
                    {
                        paymentId: payment.id,
                        status,
                        amount: payment.amount,
                        raw: event,
                    }
                );
                console.log("payment.failed saved");
                break;

            default:
                console.log("Unhandled event:", event.event);
        }

        return {
            provider: "razorpay",
            orderId: payment.order_id,
            paymentId: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            status,
        };

    }
}
