import { useState } from "react";

const Hero = () => {
    const [apiKey, setApiKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerateKey = async () => {
        setLoading(true);
        setCopied(false);
        setApiKey(null);

        try {
            const res = await fetch("http://localhost:5000/api/keys/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })

            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                console.log(data.err || "Failed to generate Key");
                return;
            }

            setApiKey(data.apiKey);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gray-50 text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to VaultPay Dashboard</h1>
            <p className="text-gray-600 mb-6">Here you can generate API keys, view analytics, and access documentation.</p>

            {!apiKey ? (
                <button
                    onClick={handleGenerateKey}
                    disabled={loading}
                    className={`px-8 py-3 rounded-xl text-white font-medium transition-all ${loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
                        }`}
                >
                    {loading ? "Generating..." : "Generate New API Key"}
                </button>
            ) : (
                <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-left relative">
                    <p className="text-gray-500 text-sm mb-1">Your API Key:</p>
                    <p className="font-mono text-blue-700 break-all text-sm bg-white p-2 rounded-lg shadow-inner">
                        {apiKey}
                    </p>
                    <button
                        onClick={handleCopy}
                        className="absolute top-4 cursor-pointer right-4 text-sm text-blue-600 hover:text-blue-800"
                    >
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default Hero;