

export interface ProviderAdaptor {

    createPayment(params: {
        amount: number;
        currency: string;
        metadata: Record<string, any>
    }): Promise<{
        orderId: string;
        amount: number;
        currency: string;
        provider: string;
        status: "pending" | "created" | "failed" | "success";
    }>  

    refundPayment(params: {
        paymentId: string,
        amount?: number,
        speed?: "normal" | "optimum",
    }): Promise<{
        refundId: string;
        amount: number;
        currency: string;
        status: string;
    }>
    
}

export interface WebhookAdapter {
  verifyWebhook(req: any): any;
  normalizeWebhook(event: any): Promise<any>;
}