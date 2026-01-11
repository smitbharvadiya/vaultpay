import React, { useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiPlus, FiX, FiShield, FiExternalLink, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";

const GatewayConnection = () => {
    const [openRazorpayConnect, setOpenRazorpayConnect] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const [secret, setSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);

    const handleRayzorpayAuth = async () => {
        try {
            setLoading(true);

            const res = await fetch("http://localhost:5000/gateways/razorpay/connect", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    keyId: apiKey,
                    keySecret: secret,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Connection failed");

            setIsConnected(true);
            setOpenRazorpayConnect(false);
            alert("Razorpay connected successfully ✅");

        } catch (err) {
            console.error("Error:", err.message);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch("http://localhost:5000/gateways/razorpay/status", {
                    method: "GET",
                    credentials: "include",
                })

                const data = await res.json();
                setIsConnected(data.connected);

            } catch {
                setIsConnected(false);
            }
        }
        fetchStatus();
    }, []);

    const handleDeleteGateway = async () => {
        try {
            const res = await fetch("http://localhost:5000/gateways/razorpay", {
                method: "DELETE",
                credentials: "include",
            })

            const data = await res.json();

            if (res.ok) {
                setIsConnected(false); 
                setShowDropdown(false); 
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
        const handleClickOutSide = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutSide);
        return () => document.removeEventListener("mousedown", handleClickOutSide);
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
            <div className="bg-white border border-zinc-200 rounded-[24px] p-6 hover:shadow-md transition-all max-w-sm">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2 mb-4">
                        <h3 className="text-lg font-bold text-zinc-900 capitalize">Razorpay</h3>
                        {isConnected ? (
                            <span className="w-fit flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100">
                                <FiCheckCircle /> ACTIVE
                            </span>
                        ) : (
                            <span className="w-fit px-3 py-1 bg-zinc-50 text-zinc-400 text-[10px] font-bold rounded-full border border-zinc-100">
                                OFFLINE
                            </span>
                        )}
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="p-2 hover:bg-zinc-50 rounded-full text-zinc-400 hover:text-zinc-900 transition-all cursor-pointer"
                        >
                            <BsThreeDotsVertical />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mr-1 w-40 bg-white border border-zinc-200 rounded-lg shadow-xl shadow-zinc-200/50 z-10 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    className="w-full p-4 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                    onClick={handleDeleteGateway}
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                    Accept payments in India via UPI, Cards, and Netbanking.
                </p>

                <button
                    disabled={isConnected}
                    onClick={() => setOpenRazorpayConnect(true)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${isConnected
                        ? "bg-zinc-100 text-zinc-500 cursor-not-allowed"
                        : "bg-zinc-900 text-white hover:bg-black cursor-pointer"
                        }`}
                >
                    {isConnected ? "Connected" : <><FiPlus /> Connect Razorpay</>}
                </button>
            </div>

            {/* Modal */}
            {openRazorpayConnect && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md transition-opacity"
                        onClick={() => setOpenRazorpayConnect(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl border border-white/20 p-8 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setOpenRazorpayConnect(false)}
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
                                    onChange={(e) => setSecret(e.target.value)}
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
                                onClick={handleRayzorpayAuth}
                                disabled={loading || !apiKey || !secret}
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
        </div>
    );
};

export default GatewayConnection;