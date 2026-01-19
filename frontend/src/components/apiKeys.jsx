import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiMoreVertical, FiCopy, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ApiKey = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/keys/list", {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch API keys");
                const data = await res.json();
                setApiKeys(data.apiKeys || []);
            } catch (error) {
                console.error("ERROR: ", error);
            }
        };
        fetchKeys();
    }, []);

    const handleKeyDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/keys/delete/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) {
                setApiKeys(prev => prev.filter(key => key.id !== id));
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const filteredKeys = apiKeys.filter(key =>
        key.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-10 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">API Keys</h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Manage your secret keys to integrate VaultPay into your application.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/apikey/create")}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-black transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
                >
                    <FiPlus size={18} />
                    <span>Create New Key</span>
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">

                {/* Table Filter Area */}
                {/* <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/30">
                    <div className="relative max-w-xs">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search keys..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-transparent text-sm focus:outline-none transition-all"
                        />
                    </div>
                </div> */}

                {/* Table Header */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-100">Name</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-100">Secret Key</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-100">Env</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-100">Created At</th>
                                <th className="px-6 py-4 border-b border-zinc-100 w-0"></th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-100">
                            {filteredKeys.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-zinc-400 text-sm">
                                        No API keys found.
                                    </td>
                                </tr>
                            ) : (
                                filteredKeys.map((key) => (
                                    <tr key={key.id} className="group hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-zinc-800">{key.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-fit text-xs font-mono bg-zinc-100 px-2 py-1 rounded text-zinc-600">
                                                {key.keyMasked}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-semibold text-zinc-500">{(key.env).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-zinc-500">
                                                {new Date(key.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right w-0">
                                            <button
                                                onClick={() => handleKeyDelete(key.id)}
                                                className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default ApiKey;