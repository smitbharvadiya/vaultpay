import React, { useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiPlus, FiX, FiShield, FiExternalLink, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";

const GatewayConnection = () => {
    const [apiKey, setApiKey] = useState("");
    const [razorpaySecret, setRazorpaySecret] = useState("");
    const [stripeSecret, setStripeSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [connections, setConnections] = useState({
        razorpay: false,
        stripe: false,
    });

    const [openMenu, setOpenMenu] = useState(null);
    const [activeGateway, setActiveGateway] = useState(null);

    const menuRef = useRef(null);

    const gateways = [{ name: "razorpay", desc: "Accept payments in India via UPI, Cards, and Netbanking." },
    { name: "stripe", desc: "Global payments for modern platforms" }
    ];

    const handleGatewayAuth = async () => {
        if (!activeGateway) return;

        try {
            let credentials = null;

            if (activeGateway === "stripe") {
                credentials = { secretKey: stripeSecret }
            } else if (activeGateway === "razorpay") {
                credentials = {
                    keyId: apiKey,
                    keySecret: razorpaySecret,
                }
            }

            setLoading(true);

            const res = await fetch(`https://vaultpay-4ez5.onrender.com/gateways/${activeGateway}/connect`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Connection failed");

            setConnections(prev => ({
                ...prev,
                [activeGateway]: true
            }));

            setActiveGateway(null);
            alert(`${activeGateway} connected successfully ✅`);

        } catch (err) {
            console.error("Error:", err.message);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchStatus = async () => {
            for (const gateway of gateways) {
                try {
                    const res = await fetch(`https://vaultpay-4ez5.onrender.com/gateways/${gateway.name}/status`, {
                        method: "GET",
                        credentials: "include",
                    })

                    const data = await res.json();
                    setConnections(prev => ({
                        ...prev,
                        [gateway.name]: data.connected
                    }));

                } catch {
                    setConnections(prev => ({
                        ...prev,
                        [gateway.name]: false
                    }));
                }
            }
        };
        fetchStatus();
    }, []);

    const handleDeleteGateway = async (gateway) => {
        try {
            const res = await fetch(`https://vaultpay-4ez5.onrender.com/gateways/${gateway}`, {
                method: "DELETE",
                credentials: "include",
            })

            const data = await res.json();

            if (res.ok) {
                setConnections(prev => ({
                    ...prev,
                    [gateway]: false
                }));
                setOpenMenu(null);
                alert("Gateway removed successfully");
            } else {
                throw new Error(data.message || "Failed to remove gateway");
            }
        } catch (err) {
            console.error("Delete Error:", err);
            alert(err.message);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div className="p-8 max-w-4xl">

            <div className="pb-2">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Payment Gateways</h2>
                <p className="text-zinc-500 max-w-lg mb-2">
                    Connect and manage your payment providers. Use multiple gateways simultaneously to optimize conversion and redundancy.
                </p>
            </div>

            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <FiAlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div>
                    <h3 className="text-sm font-semibold text-amber-900">Developer Sandbox Mode</h3>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                        VaultPay is currently running in <strong>Demonstration Mode</strong>.
                        Please use only Test credentials from your providers.
                        Actual payment processing is disabled to protect your live data.
                    </p>
                </div>
            </div>

            {/* Gateway Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {gateways.map((gateway) => {
                    const connected = connections[gateway.name];

                    return (
                        <div
                            key={gateway.name}
                            className="flex flex-col h-full bg-white border border-zinc-200 rounded-[24px] p-6 hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-2 mb-4">
                                    <h3 className="text-lg font-bold capitalize">{gateway.name}</h3>

                                    {connected ? (
                                        <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                                            <FiCheckCircle /> ACTIVE
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-zinc-50 text-zinc-400 text-[10px] font-bold rounded-full">
                                            OFFLINE
                                        </span>
                                    )}
                                </div>

                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() =>
                                            setOpenMenu(openMenu === gateway.name ? null : gateway.name)
                                        }
                                        className="p-2 hover:bg-zinc-50 rounded-full cursor-pointer"
                                    >
                                        <BsThreeDotsVertical />
                                    </button>

                                    {openMenu === gateway.name && (
                                        <div
                                            className="absolute right-0 w-40 bg-white rounded-lg shadow-xl"
                                        >
                                            <button
                                                onClick={() => handleDeleteGateway(gateway.name)}
                                                className="w-full p-4 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-sm text-zinc-500 mb-6">{gateway.desc}</p>
                            <div className="mt-auto">
                                <button
                                    disabled={connected}
                                    onClick={() => setActiveGateway(gateway.name)}
                                    className={`w-full py-3 rounded-xl font-bold ${connected
                                        ? "bg-zinc-100 text-zinc-500"
                                        : "bg-zinc-900 text-white hover:bg-black"
                                        }`}
                                >
                                    {connected ? "Connected" : `Connect ${gateway.name}`}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>


            {/* Modal */}
            {/* Razorpay Model */}
            {activeGateway === "razorpay" && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md transition-opacity"
                        onClick={() => setActiveGateway(null)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl border border-white/20 p-8 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setActiveGateway(null)}
                            className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                            <FiX size={20} />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Connect Razorpay</h2>
                            <p className="text-zinc-500 text-sm">Enter your Test API keys from your Razorpay Dashboard Settings.</p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Key ID</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="rzp_test_..."
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200  focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all font-mono text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Key Secret</label>
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    onChange={(e) => setRazorpaySecret(e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all font-mono text-sm"
                                />
                            </div>

                            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                                <FiShield className="text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-[11px] text-blue-700 leading-relaxed">
                                    Your keys are encrypted before being stored. Never share your <b>Key Secret</b> with anyone else.
                                </p>
                            </div>

                            <button
                                onClick={handleGatewayAuth}
                                disabled={loading || !apiKey || !razorpaySecret}
                                className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <FiLoader className="animate-spin" />
                                        Connecting to Razorpay...
                                    </>
                                ) : (
                                    "Save Connection"
                                )}
                            </button>

                            <a href="https://razorpay.com/docs/payments/dashboard/settings/api-keys/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1 text-xs text-zinc-400 hover:text-zinc-900 transition-colors pt-2">
                                Where do I find my keys? <FiExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
            {/* Stripe Model */}
            {activeGateway === "stripe" && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md"
                        onClick={() => setActiveGateway(null)}
                    />

                    <div className="relative bg-white w-full max-w-md rounded-xl p-8">
                        <button
                            onClick={() => setActiveGateway(null)}
                            className="absolute top-6 right-6"
                        >
                            <FiX size={20} />
                        </button>

                        <h2 className="text-2xl font-bold mb-2">Connect Stripe</h2>
                        <p className="text-sm text-zinc-500 mb-6">
                            Enter your Stripe Test Secret Key
                        </p>

                        <input
                            type="password"
                            placeholder="sk_test_..."
                            onChange={(e) => setStripeSecret(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg font-mono text-sm"
                        />

                        <button
                            onClick={handleGatewayAuth}
                            disabled={loading || !stripeSecret}
                            className="mt-6 w-full py-3 bg-zinc-900 text-white rounded-xl"
                        >
                            {loading ? "Connecting..." : "Save Connection"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GatewayConnection;