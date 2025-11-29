import { providerRegistry } from "./adapters/providerRegistry";

export class PaymentService {

    static async createPayment(provider: string, params: {
        amount: number,
        currency: string,
        metadata: Record<string, any>
    }) {
        const adaptorFactory = providerRegistry[provider];

        if (!adaptorFactory) {
            throw new Error(`Provider "${provider}" not supported.`);
        }

        const adaptor = adaptorFactory();

        return adaptor.createPayment(params);
    }
}