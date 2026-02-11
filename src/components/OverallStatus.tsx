'use client';

import { formatDistanceToNow } from 'date-fns';

interface OverallStatusProps {
  status: 'up' | 'degraded' | 'down';
  lastUpdated: string;
}

export function OverallStatus({ status, lastUpdated }: OverallStatusProps) {
  const statusConfig = {
    up: {
      icon: '✓',
      title: 'All Systems Operational',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      iconBg: 'bg-emerald-500',
    },
    degraded: {
      icon: '!',
      title: 'Partial System Outage',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      iconBg: 'bg-amber-500',
    },
    down: {
      icon: '✕',
      title: 'Major System Outage',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      iconBg: 'bg-red-500',
    },
  };

  const config = statusConfig[status];
  const updatedAgo = formatDistanceToNow(new Date(lastUpdated), { addSuffix: true });

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-6`}>
      <div className="flex items-center gap-4">
        <div className={`${config.iconBg} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold`}>
          {config.icon}
        </div>
        <div>
          <h1 className={`text-2xl font-semibold ${config.text}`}>
            {config.title}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Last checked {updatedAgo}
          </p>
        </div>
      </div>
    </div>
  );
}
