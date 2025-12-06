

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
        raw: any;
    }>

    verifyWebhook(req: any): any;

    normalizeWebhook(event: any): any;
    
}