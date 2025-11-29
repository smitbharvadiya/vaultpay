import { ProviderAdaptor } from "./ProviderAdapter";
import { RazorpayAdapter } from "./RazorpayAdapter";

export const providerRegistry: Record<string, () => ProviderAdaptor> = {
    razorpay: () => new RazorpayAdapter(),
    // stripe: () => new StripeAdapter(),
    // paypal: () => new PaypalAdapter(),
}