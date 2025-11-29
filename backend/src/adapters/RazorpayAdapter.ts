
import Razorpay from "razorpay";
import { ProviderAdaptor } from "./ProviderAdapter";

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


}