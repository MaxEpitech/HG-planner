"use client";

import { motion } from "framer-motion";

type DataPoint = {
  label: string;
  value: number;
  color?: string;
};

type SimpleBarChartProps = {
  data: DataPoint[];
  height?: number;
  barColor?: string;
};

export function SimpleBarChart({ data, height = 200, barColor = "bg-emerald-500" }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex h-full items-end gap-2 sm:gap-4">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div key={index} className="group relative flex h-full flex-1 flex-col justify-end">
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition group-hover:opacity-100 z-10 w-max">
                <div className="rounded bg-slate-800 px-2 py-1 text-xs text-white shadow-xl border border-white/10">
                  <span className="font-bold">{item.value}</span> {item.label}
                </div>
              </div>
              
              {/* Bar */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${percentage}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-full rounded-t-md opacity-80 transition hover:opacity-100 ${item.color || barColor}`}
              />
              
              {/* Label */}
              <div className="mt-2 text-center text-[10px] text-slate-400 truncate w-full">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
