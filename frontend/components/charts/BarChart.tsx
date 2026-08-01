"use client";

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function BarChart({
  data,
  height = 200,
  color = "#3b82f6",
}: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div className="flex w-full items-end justify-between gap-2" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md transition-all"
              style={{
                height: `${(item.value / max) * 100}%`,
                backgroundColor: color,
                minHeight: item.value > 0 ? 4 : 2,
                opacity: item.value > 0 ? 1 : 0.15,
              }}
            />
          </div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate w-full text-center">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

