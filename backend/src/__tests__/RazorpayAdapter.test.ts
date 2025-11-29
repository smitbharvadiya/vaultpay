

import { RazorpayAdapter } from "../adapters/RazorpayAdapter";

jest.mock("razorpay", () => {
    return jest.fn().mockImplementation(() => ({
        orders: {
            create: jest.fn().mockResolvedValue({
                id: "order_123",
                amount: 500,
                currency: "INR",
                status: "created",
            })
        },
    }));
});

test("RazorpayAdapter creates payment correctly", async () => {
    const adaptor = new RazorpayAdapter();

    const response = await adaptor.createPayment({
        amount: 500,
        currency: "INR",
        metadata: {}
    });

    expect(response.paymentId).toBe("order_123");
    expect(response.amount).toBe(500);
    expect(response.status).toBe("created");
})