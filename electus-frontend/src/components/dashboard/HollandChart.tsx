import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface HollandChartProps {
  distribution: { code: string; label: string; value: number; color: string }[];
}

export function HollandChart({ distribution }: HollandChartProps) {
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={distribution}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {distribution.map((entry, index) => (
              <Cell key={index} fill={entry.color} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, _: string, props: any) => [
              `${value}%`,
              props.payload.label,
            ]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              backgroundColor: "hsl(220, 35%, 12%)",
              color: "rgba(255,255,255,0.8)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {distribution.map((d) => (
          <div key={d.code} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-[11px] text-white/50">
              {d.code} – {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
