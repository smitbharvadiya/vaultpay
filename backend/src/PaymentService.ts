import { providerRegistry } from "./adapters/providerRegistry";
import paymentModel from "./models/paymentModel";
import refundModel from "./models/refund";

export class PaymentService {

    static async createPayment(provider: string, params: {
        amount: number,
        currency: string,
        metadata: Record<string, any>,
        userId?: string,
        apiKeyId?: string,
        env?: string,
    }) {
        const adaptorFactory = providerRegistry[provider];

        if (!adaptorFactory) {
            throw new Error(`Provider "${provider}" not supported.`);
        }

        const adaptor = await adaptorFactory(params.userId!);

        const paymentResult = await adaptor.createPayment(params);

        const savedPayment = await paymentModel.create({
            userId: params.userId,
            apiKeyId: params.apiKeyId,
            env: params.env,
            provider,
            orderId: paymentResult.orderId,
            amount: paymentResult.amount,
            currency: paymentResult.currency.toUpperCase(),
            status: paymentResult.status,
        });

        return {
            payment: savedPayment,
            clientSecret: paymentResult.clientSecret ?? null,
        };

    }

    static async getPaymentStatus(orderId: string) {
        const payment = await paymentModel.findOne({ orderId });

        if (!payment) {
            throw new Error("Payment not found");
        }

        return {
            orderId: payment.orderId,
            provider: payment.provider,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
        }
    }

    static async refundPayment(params: {
        paymentId: string;
        amount?: number;
        speed?: "normal" | "optimum";
    }) {
        const payment = await paymentModel.findOne({ paymentId: params.paymentId });

        if (!payment) {
            throw new Error("Payment not found");
        }

        const provider = payment.provider;

        const adaptorFactory = providerRegistry[provider];

        if (!adaptorFactory) {
            throw new Error("Provider not supported");
        }

        const adaptor = await adaptorFactory(payment.userId.toString());

        const refund = await adaptor.refundPayment(params);

        const saved = await refundModel.create({
            paymentId: payment.paymentId,
            refundId: refund.refundId,
            provider,
            amount: refund.amount,
            currency: refund.currency,
            status: refund.status,
        });

        return saved;
    };

}

