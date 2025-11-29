
import { PaymentService } from "../PaymentService";

jest.mock("../adapters/providerRegistry", () => ({
  providerRegistry: {
    razorpay: jest.fn(() => ({
      createPayment: jest.fn().mockResolvedValue({
        provider: "razorpay",
        paymentId: "test-123",
      }),
    })),
  },
}));


describe("PaymentService.createPayment", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should call RazorpayAdapter when provider=razorpay", async () => {

        const result = await PaymentService.createPayment("razorpay", {
            amount: 100,
            currency: "INR",
            metadata: {}
        });

        expect(result.provider).toBe("razorpay");

    });

    test("should throw error for unsupported provider", async () => {

        const params = {
            amount: 500,
            currency: "INR",
            metadata: {}
        };

        await expect(
            PaymentService.createPayment("unknown", params)
        ).rejects.toThrow('Provider "unknown" not supported.');
    });


})
