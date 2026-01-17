import Stripe from 'stripe';
import { ProviderAdaptor } from "./ProviderAdapter";
import { decrypt } from '../utils/decrypt';

export class StripeAdapter implements ProviderAdaptor {

    private client: Stripe;

    constructor(encryptedCredentials: {
        iv: string;
        content: string;
        authTag: string;
    }) {
        try {
            const { secretKey } = decrypt(encryptedCredentials);

            this.client = new Stripe(secretKey);

        } catch (err) {
            console.error("Decrypt failed:", err);
            throw new Error("Gateway credentials corrupted or key mismatch");
        }
    }

    private mapStatus = (status: Stripe.PaymentIntent.Status): "CREATED" | "PENDING" | "FAILED" | "SUCCESS" => {
        switch (status) {
            case "requires_payment_method":
                return "CREATED";
            case "requires_action":
                return "PENDING";
            case "succeeded":
                return "SUCCESS";
            default:
                return "FAILED";
        }
    };


    async createPayment(params: {
        amount: number;
        currency: string;
        metadata: Record<string, any>;
    }) {

        const intent = await this.client.paymentIntents.create({
            amount: params.amount,
            currency: params.currency,
            metadata: params.metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log(intent.client_secret);


        return {
            orderId: intent.id,
            clientSecret: intent.client_secret!,
            amount: Number(intent.amount),
            currency: intent.currency,
            provider: "stripe",
            status: this.mapStatus(intent.status),
        }

    }

    async refundPayment(params: {
        paymentId: string;
        amount?: number;
    }) {

        const refund = await this.client.refunds.create({
            payment_intent: params.paymentId,
            amount: params.amount,
        });

        const mapStatus = (s: string | null): "success" | "pending" | "failed" => {
            if (s === "succeeded") return "success";
            if (s === "pending") return "pending";
            return "failed";
        };

        return {
            refundId: refund.id,
            amount: refund.amount,
            currency: refund.currency,
            status: mapStatus(refund.status),
        };
    }


}

