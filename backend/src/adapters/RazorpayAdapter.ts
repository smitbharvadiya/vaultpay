
import Razorpay from "razorpay";
import { ProviderAdaptor } from "./ProviderAdapter";
import crypto from "crypto";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import paymentModel from "../models/paymentModel";

export class RazorpayAdapter implements ProviderAdaptor {

    private client: Razorpay;

    constructor() {
        this.client = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        })
    }

    async createPayment(params: {
        amount: number;
        currency: string;
        metadata: Record<string, any>;
    }) {

        const order = await this.client.orders.create({
            amount: params.amount * 100,
            currency: params.currency,
            notes: params.metadata,
        });

        const mapStatus = (status: string): "created" | "pending" | "failed" | "success" => {
            switch (status) {
                case "created":
                    return "created";
                case "attempted":
                    return "pending";
                case "paid":
                    return "success";
                default:
                    return "failed";
            }
        };

        return {
            orderId: order.id,
            amount: Number(order.amount),
            currency: order.currency,
            provider: "razorpay",
            status: mapStatus(order.status),
            raw: order,
        }
    };

    async refundPayment(params: {
        paymentId: string;
        amount?: number;
        speed?: "normal" | "optimum";
    }) {
        try {
            // Build refund params dynamically
            const refundParams: any = {
                speed: params.speed || "normal",
            };

            if (params.amount !== undefined) {
                refundParams.amount = params.amount * 100;
            }

            const refund = await this.client.payments.refund(params.paymentId, refundParams);

            const mapStatus = (s: string) => {
                if (s === "processed") return "success";
                if (s === "pending") return "pending";
                return "failed";
            };

            return {
                refundId: refund.id,
                amount: refund.amount !== undefined ? refund.amount / 100 : 0,
                currency: refund.currency,
                status: mapStatus(refund.status),
                raw: refund,
            };

        } catch (err: any) {
            console.error("Razorpay refund error:", err);
            throw new Error("Refund Failed: " + JSON.stringify(err));
        }
    }


    verifyWebhook(req: any) {
        const webhookBody = req.body
        const webhookSignature = req.get("X-Razorpay-Signature") as string
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string

        if (!validateWebhookSignature(JSON.stringify(webhookBody), webhookSignature, webhookSecret)) {
            console.log("Signature validation failed!")
            throw new Error("Invalid Razorpay webhook signature")
        }

        console.log("Signature validation successful!")
        return JSON.parse(JSON.stringify(webhookBody))
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
        | "EXPIRED"
        = "ATTEMPTED";

        switch (event.event) {

            case "payment.authorized": 
                    status = "AUTHORIZED";
                    await paymentModel.findOneAndUpdate(
                    { orderId: payment.order_id },
                    {
                        paymentId: payment.id,
                        status,
                        amount: payment.amount / 100,
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
                        amount: payment.amount / 100,
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
                    amount: payment.amount / 100,
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
            amount: payment.amount / 100,
            currency: payment.currency,
            status,
        };

    }

}