import { providerRegistry } from "./adapters/providerRegistry";
import paymentModel from "./models/paymentModel";

export class PaymentService {

    static async createPayment(provider: string, params: {
        amount: number,
        currency: string,
        metadata: Record<string, any>,
        userId?: string,
    }) {
        const adaptorFactory = providerRegistry[provider];

        if (!adaptorFactory) {
            throw new Error(`Provider "${provider}" not supported.`);
        }

        const adaptor = adaptorFactory();

        const paymentResult = await adaptor.createPayment(params);

        const saved = await paymentModel.create({
            userId: params.userId,
            provider,
            orderId: paymentResult.orderId,
            amount: paymentResult.amount / 100,
            currency: paymentResult.currency,
            status: paymentResult.status,
            raw: paymentResult.raw,
        });

        return saved;
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
            metadata: payment.raw,
        }
    }
}