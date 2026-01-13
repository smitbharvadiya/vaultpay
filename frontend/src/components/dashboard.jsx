import React from "react";
import { 
  FiHome, FiKey, FiActivity, FiGlobe, FiSettings, 
  FiHelpCircle, FiLogOut, FiArrowUpRight, FiZap 
} from "react-icons/fi";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans selection:bg-zinc-900 selection:text-white">
      
      

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto p-10">
        
        {/* Header Area */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Volume" value="$284,392" trend="+12.5%" />
          <StatCard label="Transactions" value="12,847" trend="+8.2%" />
          <StatCard label="Success Rate" value="99.2%" trend="+0.4%" />
          <StatCard label="Active APIs" value="24" trend="-2" trendColor="text-red-500" />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-12 gap-8">
            {/* Chart Simulation */}
            <div className="col-span-8 bg-white border border-zinc-200 rounded-[32px] p-8 min-h-[400px]">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold">Transaction Volume</h3>
                    <div className="flex bg-zinc-100 p-1 rounded-xl">
                        <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold">Volume</button>
                        <button className="px-4 py-1.5 text-zinc-400 text-xs font-bold">Count</button>
                    </div>
                </div>
                {/* Visual Chart Placeholder */}
                <div className="w-full h-64 bg-gradient-to-t from-zinc-50 to-transparent rounded-2xl flex items-end px-4 gap-2">
                    {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                        <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-zinc-900 rounded-t-lg opacity-[0.03] hover:opacity-100 transition-opacity cursor-pointer" />
                    ))}
                </div>
            </div>

            {/* Integrations List */}
            <div className="col-span-4 bg-white border border-zinc-200 rounded-[32px] p-8">
                <h3 className="font-bold mb-6">Integrations</h3>
                <div className="space-y-6">
                    <IntegrationItem name="Stripe" requests="45.2K" />
                    <IntegrationItem name="Razorpay" requests="32.1K" active />
                    <IntegrationItem name="PayPal" requests="12.8K" />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

/* --- SUBCOMPONENTS --- */


const StatCard = ({ label, value, trend, trendColor = "text-emerald-500" }) => (
  <div className="bg-white border border-zinc-200 p-6 rounded-2xl hover:shadow-xl hover:shadow-zinc-200/50 transition-all cursor-default">
    <p className="text-zinc-400 text-xs font-medium mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
      <span className={`text-[10px] font-bold ${trendColor}`}>{trend}</span>
    </div>
  </div>
);

const IntegrationItem = ({ name, requests, active }) => (
    <div className="flex items-center justify-between group cursor-pointer">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100 group-hover:bg-white transition-colors">
                <FiGlobe className="text-zinc-400" />
            </div>
            <div>
                <p className="text-sm font-bold text-zinc-900">{name}</p>
                <p className="text-[10px] text-zinc-400 font-medium">{requests} requests</p>
            </div>
        </div>
        {active && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
    </div>
)

export default Dashboard;