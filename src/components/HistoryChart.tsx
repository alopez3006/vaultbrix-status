'use client';

import { HistoryEntry } from '@/lib/history';

interface HistoryChartProps {
  name: string;
  data: HistoryEntry[];
}

export function HistoryChart({ name, data }: HistoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-vaultbrix-card border border-slate-800 rounded-lg p-4">
        <div className="text-sm font-medium mb-3">{name}</div>
        <div className="text-slate-500 text-sm">No data available</div>
      </div>
    );
  }

  const maxResponseTime = Math.max(...data.map((d) => d.responseTime));
  const minResponseTime = Math.min(...data.map((d) => d.responseTime));
  const avgResponseTime = Math.round(
    data.reduce((sum, d) => sum + d.responseTime, 0) / data.length
  );

  return (
    <div className="bg-vaultbrix-card border border-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">{name}</div>
        <div className="flex gap-4 text-xs text-slate-400">
          <span>Min: {minResponseTime}ms</span>
          <span>Avg: {avgResponseTime}ms</span>
          <span>Max: {maxResponseTime}ms</span>
        </div>
      </div>

      {/* Simple bar chart */}
      <div className="flex items-end gap-0.5 h-16">
        {data.map((entry, i) => {
          const height = (entry.responseTime / maxResponseTime) * 100;
          const color =
            entry.status === 'up'
              ? 'bg-emerald-500'
              : entry.status === 'degraded'
              ? 'bg-amber-500'
              : 'bg-red-500';

          return (
            <div
              key={i}
              className={`flex-1 ${color} rounded-t opacity-80 hover:opacity-100 transition-opacity`}
              style={{ height: `${Math.max(height, 5)}%` }}
              title={`${new Date(entry.timestamp).toLocaleTimeString()}: ${entry.responseTime}ms`}
            />
          );
        })}
      </div>

      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>24h ago</span>
        <span>Now</span>
      </div>
    </div>
  );
}
