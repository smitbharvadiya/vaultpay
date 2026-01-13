import ConnectedGateway from "../models/connectedGateway";
import { ProviderAdaptor } from "./ProviderAdapter";
import { RazorpayAdapter } from "./RazorpayAdapter";
import { StripeAdapter } from "./stripeAdapter";

export type ProviderFactory = (userId: string) => Promise<ProviderAdaptor>;

export const providerRegistry: Record<string, ProviderFactory> = {
  razorpay: async (userId: string) => {
    const gateway = await ConnectedGateway.findOne({
      userId,
      provider: "razorpay",
      status: "CONNECTED",
      is_active: true,
    });

    if (!gateway) throw new Error("Razorpay not connected");

    return new RazorpayAdapter(gateway.credentials);
  },
  stripe: async (userId: string) => {
    const gateway = await ConnectedGateway.findOne({
      userId,
      provider: "stripe",
      status: "CONNECTED",
      is_active: true,
    });

    if (!gateway) throw new Error("Stripe not connected");

    return new StripeAdapter(gateway.credentials);
  },
};
