import { useEffect, useState } from "react";
import {
    Download,
    Search,
    Filter,
    ChevronRight
} from "lucide-react";

const Transactions = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [selectedKey, setSelectedKey] = useState("");
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {

        const fetchKeys = async () => {
            try {
                const res = await fetch("https://vaultpay-4ez5.onrender.com/api/keys/list", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch API keys");

                const data = await res.json();
                const keys = data.apiKeys || [];

                setApiKeys(keys);

                // Validate saved key
                const savedKey = localStorage.getItem("selectedApiKey");
                const isValid = keys.some(k => k.id === savedKey);

                if (isValid) {
                    setSelectedKey(savedKey);
                } else {
                    setSelectedKey(""); // Default → ALL
                    localStorage.setItem("selectedApiKey", "");
                }
            } catch (error) {
                console.error("ERROR: ", error);
            }
        };
        fetchKeys();
    }, []);

    useEffect(() => {

        const fetchPayments = async () => {
            setLoading(true);
            try {
                const query = selectedKey ? `?apiKeyId=${selectedKey}` : "";
                const res = await fetch(`https://vaultpay-4ez5.onrender.com/payments${query}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch Payments");

                const data = await res.json();
                setPayments(data.payments || []);

            } catch (err) {
                console.error("Error fetching payments", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [selectedKey]);

    // Helper for Status Badge Styling
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case "success":
            case "captured":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "failed":
                return "bg-rose-50 text-rose-700 border-rose-100";
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-100";
            default:
                return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    const filteredPayments = payments.filter((payment) => {
        const statusMatch =
            !selectedStatus ||
            payment.status?.toLowerCase() === selectedStatus.toLowerCase();

        const searchMatch =
            !searchQuery ||
            payment.orderId?.toLowerCase().includes(searchQuery.toLowerCase());

        return statusMatch && searchMatch;
    });

    return (
        <div className="p-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <p className=" text-xs text-[#737373] font-semibold uppercase tracking-widest mb-1">Transactions</p>
                        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
                        <p className="text-gray-500 text-sm">View and manage your transaction records</p>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative min-w-[360px]">
                        <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Order ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-900 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Filter size={16} />
                            <span>Filter by:</span>
                            <select
                                value={selectedKey}
                                onChange={(e) => {
                                    setSelectedKey(e.target.value);
                                    localStorage.setItem("selectedApiKey", e.target.value);
                                }}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none"
                            >
                                <option value="">All</option>
                                {apiKeys.map((key) => (
                                    <option key={key.id} value={key.id}>
                                        {key.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 border-l pl-4 border-gray-100">
                            <span>Status:</span>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm"
                            >
                                <option value="">All</option>
                                <option value="created">Created</option>
                                <option value="failed">Failed</option>
                                <option value="pending">Pending</option>
                                <option value="captured">Captured</option>
                            </select>
                        </div>
                    </div>

                </div>

                {/* Table Container */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Payment ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Provider</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Currency</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">Loading payments...</td></tr>
                                ) : filteredPayments.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-medium">No transactions found</td></tr>
                                ) : (
                                    filteredPayments.map((payment) => (
                                        <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                                    {payment.orderId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-700">{payment.provider}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                {(payment.amount / 100).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                {payment.currency.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles(payment.status)}`}>
                                                    {payment.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="text-xs text-zinc-500 px-6 py-4 text-right">
                                                {new Date(payment.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer (Static for UI) */}
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <span className="text-sm text-gray-500">Showing {filteredPayments.length} transactions</span>
                        <div className="flex gap-2">
                            <button disabled className="p-1 rounded border border-gray-200 bg-white text-gray-300">
                                <ChevronRight size={18} className="rotate-180" />
                            </button>
                            <button className="p-1 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;