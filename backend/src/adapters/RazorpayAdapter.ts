
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
            amount: params.amount,
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
            paymentId: order.id,
            amount: Number(order.amount),
            currency: order.currency,
            provider: "razorpay",
            status: mapStatus(order.status),
            raw: order,
        }
    };

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

    // async normalizeWebhook(event: any) {
    //     console.log(event);
    //     const payment = event.payload.payment.entity;

    //     switch (event.event) {
    //         case "payment.captured":
    //             await paymentModel.findOneAndUpdate(
    //                 {order})
    //             break;
    //         case "payment.failed":
    //             // mark payment failed
    //             break;

    //         case "order.paid":
    //             // order is fully paid
    //             break;

    //         default:
    //             console.log("Unhandled event:", event);
    //     }
    // }

}