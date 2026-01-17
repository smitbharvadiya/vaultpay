
import Razorpay from "razorpay";
import { ProviderAdaptor } from "./ProviderAdapter";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import paymentModel from "../models/paymentModel";
import { decrypt } from "../utils/decrypt";

export class RazorpayAdapter implements ProviderAdaptor {

    private client: Razorpay;

    constructor(encryptedCredentials: {
        iv: string;
        content: string;
        authTag: string;
    }) {
        try {
            const { keyId, keySecret } = decrypt(encryptedCredentials);

            this.client = new Razorpay({
                key_id: keyId,
                key_secret: keySecret,
            });

        } catch (err) {
            console.error("Decrypt failed:", err);
            throw new Error("Gateway credentials corrupted or key mismatch");
        }
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

        const mapStatus = (status: string): "CREATED" | "PENDING" | "FAILED" | "SUCCESS" => {
            switch (status) {
                case "created":
                    return "CREATED";
                case "attempted":
                    return "PENDING";
                case "paid":
                    return "SUCCESS";
                default:
                    return "FAILED";
            }
        };

        return {
            orderId: order.id,
            amount: Number(order.amount),
            currency: order.currency,
            provider: "razorpay",
            status: mapStatus(order.status),
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
                refundParams.amount = params.amount;
            }

            const refund = await this.client.payments.refund(params.paymentId, refundParams);

            const mapStatus = (s: string) => {
                if (s === "processed") return "success";
                if (s === "pending") return "pending";
                return "failed";
            };

            return {
                refundId: refund.id,
                amount: refund.amount !== undefined ? refund.amount : 0,
                currency: refund.currency,
                status: mapStatus(refund.status),
            };

        } catch (err: any) {
            console.error("Razorpay refund error:", err);
            throw new Error("Refund Failed: " + JSON.stringify(err));
        }
    }

}