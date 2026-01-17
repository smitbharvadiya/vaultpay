import React, { useEffect, useState } from "react";
import {
    FiHome, FiKey, FiActivity, FiGlobe, FiSettings,
    FiHelpCircle, FiLogOut, FiArrowUpRight, FiZap
} from "react-icons/fi";

import { TrendingUp, CreditCard, Activity, Zap, EllipsisVertical, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [totalVolume, setTotalVolume] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [activeGateways, setActiveGateways] = useState([]);
    const [successRate, setSuccessRate] = useState(0);
    const [activeAPIs, setActiveAPIs] = useState(0);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchVolume = async () => {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:5000/analytics/volume", {
                    method: "GET",
                    credentials: "include",
                })

                if (!res.ok) {
                    throw new Error("Failed to fetch payment volume");
                }

                const result = await res.json();

                setTotalVolume(result.data.totalVolume);
                setTotalTransactions(result.data.totalTransactions);
                setActiveGateways(result.data.activeGateways);
                setSuccessRate(result.data.successRate);
                setActiveAPIs(result.data.activeAPIs);
            } catch (err) {
                console.error("Volume fetch error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchVolume();
    }, []);


    return (
        <div className="flex h-screen bg-[#FAFAFA] font-sans selection:bg-zinc-900 selection:text-white">

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 ">

                {/* Header Area */}
                <header className="flex justify-between items-center px-5 py-2 border-b-1 border-[#dfdfdf] bg-white">
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
                        <p className="text-zinc-500 text-sm">Welcome back to VaultPay</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white border border-zinc-200 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-mono text-zinc-500">
                            vp_live_sk_•••••••• <FiSettings size={14} className="cursor-pointer hover:text-zinc-900" />
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-bold border border-emerald-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            ALL SYSTEMS OPERATIONAL
                        </div>
                    </div>
                </header>

                <div className="p-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <StatCard icon={<TrendingUp size={18} />} label="Total Volume" value={`₹ ${(totalVolume / 100)}`} trend="" />
                        <StatCard icon={<CreditCard size={18} />} label="Transactions" value={totalTransactions} trend="" />
                        <StatCard icon={<Activity size={18} />} label="Success Rate" value={` ${successRate}%`} trend="" />
                        <StatCard icon={<Zap size={18} />} label="Active APIs" value={activeAPIs} trend="" trendColor="text-red-500" />
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Chart Simulation */}
                        <div className="col-span-2 bg-white border border-zinc-200 rounded-[32px] p-8 min-h-[400px]">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-bold">Transaction Volume</h3>
                                <div className="flex bg-zinc-100 p-1 rounded-xl">
                                    <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold">Volume</button>
                                    <button className="px-4 py-1.5 text-zinc-400 text-xs font-bold">Count</button>
                                </div>
                            </div>
                            {/* Visual Chart Placeholder */}
                            <div className="w-full h-64 bg-gradient-to-t from-zinc-50 to-transparent rounded-2xl flex items-end px-4 gap-2">
                            </div>
                        </div>

                        {/* Integrations List */}
                        <div className="flex flex-col justify-between col-span-1 bg-white border border-zinc-200 rounded-2xl p-6">
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-semibold">Integrations</h3>
                                    <EllipsisVertical size={18} className="cursor-pointer" />
                                </div>
                                <div className="space-y-2">
                                    <IntegrationItem name="Razorpay" requests="32.1K" active={activeGateways.includes("razorpay")} />
                                    <IntegrationItem name="Stripe" requests="45.2K" active={activeGateways.includes("stripe")} />
                                </div>
                            </div>
                            {/* Integrations List Footer */}
                            <div 
                                onClick={() => navigate("/gateways")}
                                className="flex items-center gap-2 mx-auto text-sm text-[#737373] hover:text-black cursor-pointer group">
                                <h3 className="font-medium">Manage Integrations</h3>
                                <ArrowRight
                                    size={14}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};


/* --- SUBCOMPONENTS --- */

const StatCard = ({ icon, label, value, trend, trendColor = "text-emerald-500" }) => (
    <div className="bg-white border border-zinc-200 p-6 rounded-2xl hover:shadow-xl hover:shadow-zinc-200/50 transition-all cursor-pointer">
        <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-[#f9f9f9]">
                {icon}
            </div>
            <span className={`text-xs font-semibold ${trendColor}`}>{trend}</span>
        </div>
        <p className="text-[#737373] text-sm font-medium mb-1">{label}</p>
        <h2 className="text-2xl font-semibold tracking-tight">{value}</h2>
    </div>
);

const IntegrationItem = ({ name, requests, active }) => (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group cursor-pointer">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f5f5f5] rounded-xl flex items-center justify-center border border-zinc-100 group-hover:bg-white transition-colors">
                <FiGlobe className="text-zinc-400" />
            </div>
            <div>
                <p className="text-sm font-medium text-zinc-900">{name}</p>
                <p className="text-xs text-[#737373]">{requests} requests</p>
            </div>
        </div>
        {active && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
    </div>
)

export default Dashboard;