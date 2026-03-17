import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const volumeData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  volume: Math.floor(Math.random() * 800000000) + 200000000,
}));

const VolumeChart = () => {
  return (
    <div className="border border-foreground/10">
      <div className="flex items-center justify-between px-6 py-3 border-b border-foreground/10">
        <span className="text-xs uppercase tracking-[0.15em] font-bold">Volume Spikes (24h)</span>
        <span className="text-xs text-muted-foreground font-mono">Updated live</span>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={volumeData}>
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(0 0% 45%)", fontSize: 9, fontFamily: "Space Mono" }}
              interval={3}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(0 0% 45%)", fontSize: 9, fontFamily: "Space Mono" }}
              tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(40 10% 95%)",
                border: "1px solid hsl(0 0% 78%)",
                borderRadius: "0",
                fontFamily: "Space Mono",
                fontSize: "11px",
              }}
              formatter={(value: number) => [`$${(value / 1e6).toFixed(1)}M`, "Volume"]}
            />
            <Bar dataKey="volume" fill="hsl(0 0% 0%)" opacity={0.75} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VolumeChart;
