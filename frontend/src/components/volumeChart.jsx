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

const VolumeChart = ({ data = [], loading }) => {

  const getPastSevenDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const backendFormat = d.toISOString().split('T')[0];

      const displayFormat = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      const match = data.find(item => item.date === backendFormat);

      days.push({
        date: displayFormat, 
        volume: match ? match.volume : 0,
      });
    }

    return days;
  };

  const chartData = loading ? [] : getPastSevenDays();

  if (loading) {
    return (
      <div className="h-[280px] flex items-center justify-center text-zinc-400">
        Loading chart...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20 }}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 6"
          stroke="#E5E7EB"
        />

        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          interval={0}
          tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
        />

        <YAxis hide />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "#D1D5DB", strokeDasharray: "4 4" }}
        />

        <defs>
          <linearGradient id="volumeLine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#111827" stopOpacity={0.6} />
          </linearGradient>
        </defs>

        <Line
          type="monotone"
          dataKey="volume"
          stroke="url(#volumeLine)"
          strokeWidth={3}
          dot={{ r: 4, fill: "#fff", strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default VolumeChart;
