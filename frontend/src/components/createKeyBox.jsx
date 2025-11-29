import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { FiClipboard, FiCheck, FiKey, FiEye, FiEyeOff } from "react-icons/fi";
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
            const res = await fetch("http://localhost:5000/api/keys/generate", {
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            {/* Backdrop Overlay */}
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm z-40 transition-opacity duration-300" />
            )}

            {/* Main Content */}
            <div className={`max-w-2xl mx-auto transition-all duration-300 ${showModal ? "scale-95 opacity-50 pointer-events-none" : "scale-100 opacity-100"}`}>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <button
                            onClick={() => navigate("/apikey")}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 group"
                        >
                            <GoArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <span className="font-medium text-gray-900">API Keys</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-700 font-semibold">Create New</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                            <FiKey className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Create API Key</h1>
                            <p className="text-gray-500 mt-1">Generate a new secret key for API access</p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
                    <form onSubmit={handleGenerateKey} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <span>Key Name</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Production Server, Development App"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-2">Give your key a descriptive name for easy identification</p>
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm mb-4">{error}</p>
                        )}


                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${loading || !name.trim()
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Generating Key...
                                </>
                            ) : (
                                <>
                                    <FiKey className="text-lg" />
                                    Create API Key
                                </>
                            )}
                        </button>
                    </form>
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
                                ✓ Copied to clipboard!
                            </div>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
};

export default CreateKey;