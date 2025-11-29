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
            amount: paymentResult.amount,
            currency: paymentResult.currency,
            status: paymentResult.status,
            paymentId: paymentResult.paymentId,
            raw: paymentResult.raw,
        });

        return saved;
    }
}