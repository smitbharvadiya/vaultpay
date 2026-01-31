import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  Copy,
  Eye,
  EyeOff,
  Zap,
  Lock,
  Globe,
} from "lucide-react";

const Webhook = () => {
  const [activeWebhook, setActiveWebhook] = useState(null);
  const [webhookURL, setWebhookURL] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [revealSecret, setRevealSecret] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [connections, setConnections] = useState({
    razorpay: false,
    stripe: false,
  });


  const gateways = [
    { name: "Razorpay" },
    { name: "Stripe" },
  ];

  const generateCredentials = async (provider) => {
    try {
      setLoading(true);

      const res = await fetch("https://vaultpay-4ez5.onrender.com/webhook/secret/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "webhook credentials failed to generate");

      setWebhookURL(data.webhookUrl);
      if (data.secret) {
        setWebhookSecret(data.secret);
      }

      setConnections(prev => ({
        ...prev,
        [provider]: true,
      }));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveStripeSecret = async () => {
    try {
      const res = await fetch(
        "https://vaultpay-4ez5.onrender.com/webhook/stripe/save-secret",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: webhookSecret }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save Stripe secret");
        return;
      }

      const statusRes = await fetch(
        "https://vaultpay-4ez5.onrender.com/webhook/status/stripe",
        { credentials: "include" }
      );

      const statusData = await statusRes.json();

      setConnections(prev => ({
        ...prev,
        stripe: statusData.connected,
      }));

    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving Stripe secret");
    }
  };



  useEffect(() => {
    const fetchStatus = async () => {
      for (const gateway of gateways) {
        const key = gateway.name.toLowerCase();
        try {
          const res = await fetch(`https://vaultpay-4ez5.onrender.com/webhook/status/${key}`, {
            method: "GET",
            credentials: "include",
          })

          const data = await res.json();

          setConnections(prev => ({
            ...prev,
            [key]: data.connected,
          }));

        } catch (err) {
          setConnections(prev => ({
            ...prev,
            [key]: false
          }));
        }
      }
    };
    fetchStatus();
  }, []);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <header className="flex justify-between items-start mb-12">
          <div>
            <p className=" text-xs text-[#737373] font-semibold uppercase tracking-widest mb-1">Webhooks</p>
            <h1 className="text-2xl font-bold text-gray-900">Event Gateways</h1>
            <p className="text-gray-500 text-sm">Connect your applications to real-time payment events. Securely delivered, highly reliable.</p>
          </div>
        </header>

        {/* Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gateways.map((g) => {
            const key = g.name.toLowerCase();
            const connected = connections[key];

            return (
              <div
                key={g.name}
                className={`p-1 rounded-[2rem] transition-all duration-500 ${activeWebhook === key ? "bg-zinc-100" : "bg-transparent"
                  }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold mt-1">{g.name}</h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${connected
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-zinc-50 text-zinc-400"
                      }`}
                  >
                    {connected ? "Active" : "Disabled"}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-500 mb-6">
                  Receive real-time payment events securely.
                </p>

                {/* Action */}
                <button
                  disabled={connected}
                  onClick={() => {
                    setActiveWebhook(key);
                    if (!connected) generateCredentials(key);
                  }}
                  className={`mt-auto w-full py-3 rounded-xl font-bold transition cursor-pointer ${connected
                    ? "bg-zinc-100 text-zinc-500"
                    : "bg-zinc-900 text-white hover:bg-black"
                    }`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {g.type}
                      </span>
                      <h3 className="text-2xl font-bold tracking-tight">{g.name}</h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${g.status === 'Connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-400'
                      }`}>
                      {g.status}
                    </div>
                  </div>

                {/* Description */}
                <p className="text-sm text-zinc-500 mb-6">
                  Receive real-time payment events securely.
                </p>

                {/* Action */}
                <button
                  disabled={connected}
                  onClick={() => {
                    setActiveWebhook(key);
                    if (!connected) generateCredentials(key);
                  }}
                  className={`mt-auto w-full py-3 rounded-xl font-bold transition ${connected
                    ? "bg-zinc-100 text-zinc-500"
                    : "bg-zinc-900 text-white hover:bg-black"
                    }`}
                >
                  {connected ? "Connected" : "Generate Webhook"}
                </button>
              </div>
            )
          })}
        </div>

        {activeWebhook === "razorpay" && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Label for the Section */}
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Active Configuration</span>
            </div>

            {/* Main Container: Pure White against the Gray-50 background */}
            <div className="bg-white border border-zinc-200 rounded-[2rem] shadow-sm overflow-hidden">

              {/* Panel Header */}
              <div className="border-b border-zinc-100 p-8 flex items-center justify-between bg-zinc-50/30">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900">Endpoint Settings</h2>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">System Ready</span>
                </div>
              </div>

              <div className="p-8 space-y-10">
                {/* Field: Payload URL */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Globe size={14} className="text-zinc-300" /> Payload Destination
                    </label>
                    {copiedField === 'url' && (
                      <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        COPIED
                      </span>
                    )}
                  </div>

                  <div className="relative group flex items-center">
                    <div className="w-full bg-zinc-50/50 border border-zinc-100 px-5 py-4 rounded-2xl font-mono text-sm text-zinc-600 group-hover:border-zinc-300 group-hover:bg-white transition-all truncate ring-offset-2 focus-within:ring-2 ring-black/5">
                      {loading ? (
                        <span className="text-zinc-300 italic animate-pulse">Establishing secure link...</span>
                      ) : webhookURL}
                    </div>
                    <button
                      onClick={() => handleCopy(webhookURL, 'url')}
                      className="absolute right-3 p-2.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all cursor-pointer"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                {/* Field: Secret */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Lock size={14} className="text-zinc-300" /> Signing Secret
                    </label>
                    {copiedField === 'secret' && (
                      <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        COPIED
                      </span>
                    )}
                  </div>

                  <div className="relative group flex items-center">
                    <div className="w-full bg-zinc-50/50 border border-zinc-100 px-5 py-4 rounded-2xl font-mono text-sm text-zinc-600 group-hover:border-zinc-300 group-hover:bg-white transition-all truncate">
                      {loading ? (
                        <span className="text-zinc-300 italic animate-pulse">Generating keys...</span>
                      ) : (revealSecret ? webhookSecret : "•".repeat(32))}
                    </div>
                    <div className="absolute right-3 flex gap-1">
                      <button
                        onClick={() => setRevealSecret(!revealSecret)}
                        className="p-2.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all cursor-pointer"
                      >
                        {revealSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => handleCopy(webhookSecret, 'secret')}
                        className="p-2.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all cursor-pointer"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeWebhook === "stripe" && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Active Configuration
              </span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-[2rem] shadow-sm overflow-hidden">
              <div className="border-b border-zinc-100 p-8 flex items-center justify-between bg-zinc-50/30">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900">Stripe Webhook</h2>
              </div>

              <div className="p-8 space-y-10">
                {/* Payload URL (read-only) */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Globe size={14} className="text-zinc-300" /> Payload Destination
                  </label>
                  <div className="w-full bg-zinc-50/50 border border-zinc-100 px-5 py-4 rounded-2xl font-mono text-sm text-zinc-600 truncate">
                    {webhookURL}
                  </div>
                </div>

                {/* Secret Input */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Lock size={14} className="text-zinc-300" /> Stripe Signing Secret
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={revealSecret ? "text" : "password"}
                      value={webhookSecret}
                      onChange={(e) => setWebhookSecret(e.target.value)}
                      placeholder="Paste your Stripe webhook secret here"
                      className="w-full px-5 py-4 rounded-2xl border border-zinc-100 font-mono text-sm"
                    />
                    <button
                      onClick={() => setRevealSecret(!revealSecret)}
                      className="p-2.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition"
                    >
                      {revealSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button
                    onClick={saveStripeSecret}
                    className="mt-2 py-3 w-full bg-zinc-900 text-white rounded-xl font-bold hover:bg-black"
                  >
                    Save Secret
                  </button>
                </div>
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
              <li>Paste the Signing Secret.</li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Webhook;