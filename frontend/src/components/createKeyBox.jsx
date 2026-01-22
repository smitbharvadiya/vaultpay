import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { FiClipboard, FiCheck, FiKey } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const CreateKey = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [rawKey, setRawKey] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleGenerateKey = async (e) => {
        e.preventDefault();
        setError("");
        if (!name.trim()) return;

        setLoading(true);
        try {

            const res = await fetch("https://vaultpay-backend.onrender.com/api/keys/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ name })
            });

            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                setError(data.err || "Failed to generate Key");
                return;
            }

            setRawKey(data.apiKey);
            setShowModal(true);

        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(rawKey);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className=" bg-[#fcfcfc]">
            {/* Backdrop Overlay */}
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm z-40 transition-opacity duration-300" />
            )}

            <div className="flex items-center text-sm gap-2 bg-white text-gray-600 mb-4 border-b border-[#dfdfdf] p-4">
                <button
                    onClick={() => navigate("/apikey")}
                    className="hover:text-black hover:-translate-x-0.5 transition-transform cursor-pointer"
                >
                    <GoArrowLeft size={20} />
                </button>
                <span className="font-normal text-gray-600">API Keys</span>
                <span className="text-gray-900">/</span>
                <span className="text-gray-900 font-semibold">Create</span>
            </div>

            {/* Main Content */}
            <div className={`px-6 transition-all duration-300 ${showModal ? "scale-95 opacity-50 pointer-events-none" : "scale-100 opacity-100"}`}>
                {/* Header */}
                <div className="border-b border-[#dfdfdf] pb-6">
                    <h1 className="font-inter text-xl font-medium text-gray-900">Create API Key</h1>
                    <p className="text-gray-500 mt-1">Generate a new secret key for API access</p>
                </div>

                {/* Form Card */}
                <div>
                    <div>
                        <form onSubmit={handleGenerateKey} className="px-4 py-6 space-y-8">

                            {/* Input Group */}
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <label htmlFor="key-name" className="text-[12px] font-bold uppercase tracking-wider text-zinc-700">
                                        Name
                                    </label>
                                    <span className="text-red-500 px-1">*</span>
                                </div>

                                <input
                                    id="key-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Production key"
                                    className="w-[50%] bg-white border border-zinc-200  px-3 py-2.5 text-sm transition-all duration-200
                     placeholder:text-zinc-300
                     hover:border-zinc-300
                     focus:ring-[4px] focus:ring-zinc-100 focus:border-zinc-900 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
                                    <div className="w-1 h-1 rounded-full bg-red-500" />
                                    <span className="text-[12px] font-medium text-red-600">{error}</span>
                                </div>
                            )}

                            {/* Form Action */}
                            <div className="pt-4  flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate("/apikey")}
                                    className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading || !name.trim()}
                                    className={`relative min-w-[140px] flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                                    ${loading 
                                            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200"
                                            : "bg-zinc-900 text-white hover:bg-black active:scale-[0.97] shadow-sm hover:shadow-md cursor-pointer"
                                        }`}
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        "Create API Key"
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                        >
                            <IoClose />
                        </button>

                        {/* Modal Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">API Key Created</h2>
                            <p className="text-gray-500">Copy your key now - you won't see it again!</p>
                        </div>

                        {/* Key Display */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between gap-3">
                                <div className="font-mono text-sm break-all flex-1">
                                    {rawKey}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    {copied ? <FiCheck className="text-green-600" /> : <FiClipboard />}
                                </button>
                            </div>
                        </div>

                        {copied && (
                            <div className="text-green-600 text-sm font-medium mt-1 text-center animate-fade-in">
                                Copied
                            </div>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
};

export default CreateKey;