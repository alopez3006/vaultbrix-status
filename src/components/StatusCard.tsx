'use client';

import { Service } from '@/lib/status';
import { UptimeBar } from './UptimeBar';

interface StatusCardProps {
  service: Service;
}

export function StatusCard({ service }: StatusCardProps) {
  const statusColors = {
    up: 'text-emerald-400',
    down: 'text-red-500',
    degraded: 'text-amber-400',
  };

  const statusLabels = {
    up: 'Operational',
    down: 'Down',
    degraded: 'Degraded',
  };

  const statusDots = {
    up: 'bg-emerald-400',
    down: 'bg-red-500',
    degraded: 'bg-amber-400',
  };

  return (
    <div className="bg-vaultbrix-card border border-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span
            className={`w-2.5 h-2.5 rounded-full ${statusDots[service.status]}`}
          />
          <span className="font-medium">{service.name}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-500">
            {service.responseTime}ms
          </span>
          <span className={statusColors[service.status]}>
            {statusLabels[service.status]}
          </span>
        </div>
      </div>

      <UptimeBar uptime={service.uptime} />

      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>90 days ago</span>
        <span>{service.uptime}% uptime</span>
        <span>Today</span>
      </div>
    </div>
  );
}
