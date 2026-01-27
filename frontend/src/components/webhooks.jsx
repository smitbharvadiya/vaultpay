import React, { useEffect, useState } from "react";
import { Settings, CheckCircle, ArrowRight, Info } from "lucide-react";

const Webhook = () => {
  const [activeWebhook, setActiveWebhook] = useState("");
  const [webhookURL, setWebhookURL] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const gateways = [
    { name: "Razorpay", status: "Connected", color: "bg-blue-500" },
    { name: "Stripe", status: "Active", color: "bg-indigo-600" },
  ];

  const generateWebhookCredentials = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://vaultpay-4ez5.onrender.com/webhook/secret/generate",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to generate webhook credentials");
      }

      const data = await res.json();

      setWebhookURL(data.webhookUrl);
      setWebhookSecret(data.secret);
    } catch (err) {
      console.error("Webhook generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeWebhook === "Razorpay") {
      generateWebhookCredentials();
    }
  }, [activeWebhook]);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Webhook Integration
          </h1>
          <p className="text-sm text-gray-500">
            Manage your payment gateway notifications
          </p>
        </div>
        <Settings className="text-gray-400 hover:rotate-90 transition-transform duration-300 cursor-pointer" />
      </div>

      {/* Gateway List */}
      <div className="space-y-4">
        {gateways.map((gateway) => (
          <div
            key={gateway.name}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-blue-300 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-2 h-10 rounded-full ${gateway.color}`}
              />
              <div>
                <h3 className="font-semibold text-gray-800">
                  {gateway.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle size={12} />
                  <span>{gateway.status}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveWebhook(gateway.name)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Configure
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Razorpay Configuration */}
      {activeWebhook === "Razorpay" && (
        <div className="mt-6 bg-white border rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Razorpay Webhook Details
          </h2>

          <div>
            <p className="text-xs text-gray-500 mb-1">Payload URL</p>
            <div className="p-3 bg-gray-50 rounded-md text-sm font-mono break-all">
              {loading ? "Generating..." : webhookURL}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Signing Secret</p>
            <div className="p-3 bg-gray-50 rounded-md text-sm font-mono break-all">
              {loading ? "Generating..." : webhookSecret}
            </div>
          </div>
        </div>
      )}

      {/* Footer Tip */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-blue-800">
        <Info size={20} className="shrink-0" />
        <div className="text-sm">
          <p className="font-bold">Next Steps:</p>
          <ol className="list-decimal ml-4 mt-1 space-y-1">
            <li>Copy the Payload URL above.</li>
            <li>Go to your Provider Dashboard.</li>
            <li>
              Add a new Webhook and select events:
              <b> payment.captured</b> and <b> order.paid</b>.
            </li>
            <li>Paste the Signing Secret into VaultPay if required.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Webhook;
