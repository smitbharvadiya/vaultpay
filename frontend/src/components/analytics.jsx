import { useEffect, useState } from "react";
import { Activity, CheckCircle, XCircle, BarChart3, Key } from "lucide-react";

const Analytics = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [selectedKey, setSelectedKey] = useState("");
    const [totalReq, setTotalReq] = useState(0);
    const [succesfullReq, setSuccesfullReq] = useState(0);
    const [failedReq, setFailedReq] = useState(0);
    const [rpm, setRPM] = useState(0);

    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/keys/list", {
                    method: "GET",
                    credentials: "include",
                })

                if (!res.ok) {
                    throw new Error("Failed to fetch API keys");
                }

                const data = await res.json();
                setApiKeys(data.apiKeys || []);

                const savedKey = localStorage.getItem("selectedApiKey");
                setSelectedKey(savedKey || data.apiKeys?.[0]?.id || "");

            } catch (error) {
                console.log("ERROR: ", error);
            }
        }
        fetchKeys();

    }, []);

    useEffect(() => {

        if (!selectedKey) return;

        const fetchAnalytics = async () => {
            try {
                const res = await fetch(`http://localhost:5000/analytics?apiKeyId=${selectedKey}`, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                setTotalReq(data.totalReq);
                setSuccesfullReq(data.succesfullReq);
                setFailedReq(data.failedReq);
                setRPM(data.rpm);

            } catch (err) {
                console.error("Failed to get Analytics:", err);
            }
        }

        fetchAnalytics();

    }, [selectedKey]);

    return (
        <div className="p-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">API Analytics</h1>
                    <p className="text-gray-500">Monitor your API usage and performance metrics in real-time</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                    <Key size={18} className="text-gray-400 ml-2" />
                    <select
                        className="outline-none bg-transparent text-sm font-medium text-gray-700 pr-4"
                        value={selectedKey}
                        onChange={(e) => {
                            setSelectedKey(e.target.value);
                            localStorage.setItem("selectedApiKey", e.target.value);
                        }}
                    >
                        {apiKeys.length === 0 && <option>No keys found</option>}
                        {apiKeys.map((key) => (
                            <option key={key.id} value={key.id}>
                                {key.name}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Request</p>
                        <h3 className="text-2xl font-bold text-gray-900">{totalReq}</h3>
                    </div>
                    <div className={"p-3 rounded-lg bg-blue-50 text-blue-600"}>
                        <Activity size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Successful requests</p>
                        <h3 className="text-2xl font-bold text-gray-900">{succesfullReq}</h3>
                    </div>
                    <div className={"p-3 rounded-lg bg-green-50 text-green-600"}>
                        <CheckCircle size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Failed requests</p>
                        <h3 className="text-2xl font-bold text-gray-900">{failedReq}</h3>
                    </div>
                    <div className={"p-3 rounded-lg bg-red-50 text-red-600"}>
                        <XCircle size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">RPM</p>
                        <h3 className="text-2xl font-bold text-gray-900">{rpm}</h3>
                    </div>
                    <div className={"p-3 rounded-lg bg-purple-50 text-purple-600"}>
                        <BarChart3 size={24} />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Analytics;