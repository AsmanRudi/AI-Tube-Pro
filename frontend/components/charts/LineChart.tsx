"use client";

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function LineChart({
  data,
  height = 200,
  color = "#3b82f6",
}: LineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-gray-400" style={{ height }}>
        Belum ada data
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 600;
  const padding = 24;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y = height - padding - (d.value / max) * (height - padding * 2);
    return { x, y, ...d };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padding}
            x2={width - padding}
            y1={height - padding - (height - padding * 2) * t}
            y2={height - padding - (height - padding * 2) * t}
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeDasharray="4 4"
          />
        ))}

        <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color}>
            <title>{`${p.label}: ${p.value}`}</title>
          </circle>
        ))}
      </svg>

      {/* Labels */}
      <div className="mt-1 flex justify-between px-1">
        {points.map((p, i) => (
          <span key={i} className="text-[10px] text-gray-500 dark:text-gray-400">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

