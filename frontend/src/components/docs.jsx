import React, { useState } from "react";
import { FiCopy, FiCheck, FiBookOpen, FiZap, FiShield, FiCode, FiTerminal } from "react-icons/fi";

const Docs = () => {
    const [copied, setCopied] = useState("");

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(""), 2000);
    };

    const CodeBlock = ({ code, id, title }) => (
        <div className="relative group bg-zinc-950 rounded-xl border border-white/5 overflow-hidden shadow-2xl my-4">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{title || "Example"}</span>
                <button
                    onClick={() => handleCopy(code, id)}
                    className="text-zinc-500 hover:text-white transition-colors"
                >
                    {copied === id ? <FiCheck className="text-emerald-400" /> : <FiCopy size={14} />}
                </button>
            </div>
            <pre className="p-5 text-sm font-mono text-zinc-300 overflow-x-auto">
                {code}
            </pre>
        </div>
    );

    const MethodBadge = ({ method }) => {
        const styles = {
            POST: "bg-blue-50 text-blue-600 border-blue-100",
            GET: "bg-emerald-50 text-emerald-600 border-emerald-100",
            DELETE: "bg-red-50 text-red-600 border-red-100",
        };
        return (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${styles[method]}`}>
                {method}
            </span>
        );
    };

    return (
        <div className="h-screen overflow-hidden bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white flex pt-16">

            {/* Sidebar Navigation - Hidden on Mobile */}
            <aside className="h-full w-64 border-r border-zinc-100 sticky top-0 hidden md:block bg-[#fafafa]/50 p-8">
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-6 h-6 bg-zinc-900 rounded flex items-center justify-center">
                        <FiBookOpen className="text-white text-xs" />
                    </div>
                    <span className="font-bold tracking-tight">Documentation</span>
                </div>
                <nav className="space-y-8">
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Introduction</h3>
                        <ul className="space-y-3 text-sm font-medium text-zinc-500">
                            <li>
                                <a href="#overview" className="hover:text-zinc-900 transition-colors block">Overview</a>
                            </li>
                            <li>
                                <a href="#getting-started" className="hover:text-zinc-900 transition-colors block">Getting Started</a>
                            </li>
                            <li>
                                <a href="#authentication" className="hover:text-zinc-900 transition-colors block">Authentication</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Endpoints</h3>
                        <ul className="space-y-3 text-sm font-medium text-zinc-500">
                            <li>
                                <a href="#create-payment" className="hover:text-zinc-900 transition-colors block">Create Payment</a>
                            </li>
                            <li>
                                <a href="#payment-status" className="hover:text-zinc-900 transition-colors block">Payment Status</a>
                            </li>
                            <li>
                                <a href="#refund" className="hover:text-zinc-900 transition-colors block">Refund</a>
                            </li>
                            <li>
                                <a href="#analytics" className="hover:text-zinc-900 transition-colors block">Analytics</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 max-w-5xl mx-auto px-8 lg:px-16 py-10 overflow-y-auto">

                {/* Header */}
                <header id="overview" className="mb-16">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                        <span>Docs</span>
                        <span>/</span>
                        <span className="text-zinc-900 font-medium">API Reference</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tighter mb-4 text-zinc-950">VaultPay API</h1>
                    <p className="text-lg text-zinc-500 max-w-2xl leading-relaxed">
                        The VaultPay API allows you to interact with multiple payment gateways through a single standardized interface. Secure, fast, and unified.
                    </p>
                </header>

                {/* Getting Started Section */}
                <section id="getting-started" className="mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-zinc-100 rounded-lg"><FiTerminal className="text-zinc-900" /></div>
                        <h2 className="text-2xl font-bold tracking-tight">Getting Started</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-4 text-zinc-600 leading-relaxed">
                            <ol className="space-y-4 text-zinc-600 list-none counter-reset-step">
                                {[
                                    "Sign up and create an account.",
                                    "Generate your API key in the dashboard.",
                                    "Include your API key in the Authorization header.",
                                    "Start making requests to VaultPay endpoints."
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-100 text-zinc-900 text-[11px] font-bold flex items-center justify-center border border-zinc-200">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm leading-relaxed">{step}</span>
                                    </li>
                                ))}
                            </ol>                            <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl">
                                <h4 className="text-xs font-bold text-zinc-900 uppercase mb-2 flex items-center gap-2">
                                    <FiShield size={14} /> Security Tip
                                </h4>
                                <p className="text-xs">Never share your secret keys in client-side code or public repositories.</p>
                            </div>
                        </div>
                        <div>
                            <CodeBlock id="auth" code={`Authorization: Bearer <YOUR_API_KEY>`} />
                        </div>
                    </div>
                </section>

                {/* API Reference Table */}
                <section className="mb-20 border-t-1 border-[#dfdfdf] pt-16">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-2 bg-zinc-100 rounded-lg"><FiCode className="text-zinc-900" /></div>
                        <h2 className="text-2xl font-bold tracking-tight">Endpoints Reference</h2>
                    </div>

                    {/* Create Payment */}
                    <div id="create-payment" className="grid md:grid-cols-2 gap-12 mb-20">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <MethodBadge method="POST" />
                                <code className="text-sm font-bold text-zinc-900">/payment/create</code>
                            </div>
                            <p className="text-zinc-600 mb-6 text-sm leading-relaxed">
                                Creates a payment intent for a specific provider. This is the first step in processing any transaction.
                            </p>
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                                        <th className="pb-2 font-bold">Parameter</th>
                                        <th className="pb-2 font-bold">Type</th>
                                    </tr>
                                </thead>
                                <tbody className="text-zinc-600">
                                    <tr><td className="py-3 font-mono text-zinc-900">provider</td><td className="py-3 italic">string</td></tr>
                                    <tr><td className="py-3 font-mono text-zinc-900">amount</td><td className="py-3 italic">integer</td></tr>
                                    <tr><td className="py-3 font-mono text-zinc-900">currency</td><td className="py-3 italic">string</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Request Body</h4>
                            <CodeBlock id="ep1" title="Create Payment" code={`POST /payment/create
Headers:
  Authorization: Bearer YOUR_API_KEY
Body:
{
  "provider": "stripe",
  "amount": 1000,
  "currency": "INR",
  "metadata": { "orderId": "1234" }
}`} />
                        </div>
                    </div>

                    <div id="payment-status" className="grid lg:grid-cols-2 gap-12 mb-20">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <MethodBadge method="GET" />
                                <span className="font-mono text-sm font-bold">/payment/status/:id</span>
                            </div>
                            <p className="text-sm text-zinc-600">Retrieve the real-time status and metadata of a specific payment ID.</p>
                        </div>
                        <CodeBlock id="ep2" title="Check Status" code={`GET /payment/status/abcd1234
Headers:
  Authorization: Bearer YOUR_API_KEY`} />
                    </div>

                    <div id="refund" className="grid lg:grid-cols-2 gap-12 mb-20">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <MethodBadge method="POST" />
                                <span className="font-mono text-sm font-bold">/payment/refund</span>
                            </div>
                            <p className="text-zinc-600 mb-6 text-sm leading-relaxed">Refund a payment.</p>
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                                        <th className="pb-2 font-bold">Parameter</th>
                                        <th className="pb-2 font-bold">Type</th>
                                    </tr>
                                </thead>
                                <tbody className="text-zinc-600">
                                    <tr><td className="py-3 font-mono text-zinc-900">paymentId</td><td className="py-3 italic">string</td></tr>
                                    <tr><td className="py-3 font-mono text-zinc-900">amount</td><td className="py-3 italic">integer</td></tr>
                                    <tr><td className="py-3 font-mono text-zinc-900">speed</td><td className="py-3 italic">string</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <CodeBlock id="ep3" title="Process Refund" code={`POST /payment/refund
Headers:
  Authorization: Bearer YOUR_API_KEY
Body:
{
  "paymentId": "abcd1234",
  "amount": 500,
  "speed": "instant"
}`} />
                    </div>

                    {/* Analytics */}
                    <div id="analytics" className="grid md:grid-cols-2 gap-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <MethodBadge method="GET" />
                                <code className="text-sm font-bold text-zinc-900">/analytics</code>
                            </div>
                            <p className="text-zinc-600 text-sm leading-relaxed">
                                Fetch real-time usage metrics for a specific API Key. Useful for building custom merchant dashboards.
                            </p>
                        </div>
                        <div>
                            <CodeBlock id="analytics" code={`GET /analytics?apiKeyId=key_live_9921`} />
                        </div>
                    </div>
                </section>

                {/* Rate Limits */}
                <section className="bg-zinc-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <h2 className="text-2xl font-bold mb-8 relative z-10">Rate Limits</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                        {[
                            { tier: "Free", limit: "10", color: "text-zinc-500" },
                            { tier: "Pro", limit: "100", color: "text-blue-400" },
                            { tier: "Enterprise", limit: "1k+", color: "text-emerald-400" }
                        ].map((item) => (
                            <div key={item.tier} className="p-6 border border-white/10 bg-white/5 rounded-3xl hover:bg-white/10 transition-colors">
                                <div className={`text-[10px] uppercase font-bold mb-1 tracking-widest ${item.color}`}>{item.tier}</div>
                                <div className="text-3xl font-bold">{item.limit} <span className="text-xs font-normal opacity-40 uppercase tracking-tighter">rpm</span></div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>


        </div>
    );
};

export default Docs;