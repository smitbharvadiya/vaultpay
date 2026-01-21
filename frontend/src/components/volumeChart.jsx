import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl bg-white shadow-lg border border-zinc-200 px-4 py-2">
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="text-sm font-semibold text-zinc-900">
                ₹ {payload[0].value.toLocaleString()}
            </p>
        </div>
    );
};

const VolumeChart = ({ data, loading }) => {

    if (loading) {
        return (
            <div className="h-[260px] flex items-center justify-center text-gray-400">
                Loading chart...
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-[260px] flex flex-col items-center justify-center text-gray-500">
                <p className="text-sm font-medium">No transaction data yet</p>
                <p className="text-xs mt-1">
                    Transactions will appear once payments are processed
                </p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={280} >
            <LineChart data={data} margin={{ top: 20, right: 20, left: 40, bottom: 0 }}>
                {/* Soft horizontal grid */}
                <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 6"
                    stroke="#E5E7EB"
                />

                {/* X Axis */}
                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fill: "#6B7280",
                        fontSize: 12,
                        fontWeight: 500,
                    }}
                />

                {/* Hide Y Axis */}
                <YAxis hide />

                {/* Tooltip */}
                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                        stroke: "#D1D5DB",
                        strokeWidth: 1,
                        strokeDasharray: "4 4",
                    }}
                />

                {/* Gradient line */}
                <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#111827" stopOpacity={1} />
                        <stop offset="100%" stopColor="#111827" stopOpacity={0.7} />
                    </linearGradient>
                </defs>

                {/* Line */}
                <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="url(#lineGradient)"
                    strokeWidth={2.8}
                    dot={{
                        r: 4.5,
                        stroke: "#111827",
                        strokeWidth: 2,
                        fill: "#FFFFFF",
                    }}
                    activeDot={{
                        r: 6,
                        stroke: "#111827",
                        strokeWidth: 2,
                        fill: "#FFFFFF",
                    }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default VolumeChart;
