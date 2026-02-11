'use client';

import { Incident } from '@/lib/history';
import { formatDistanceToNow, format } from 'date-fns';

interface IncidentListProps {
  incidents: Incident[];
}

export function IncidentList({ incidents }: IncidentListProps) {
  if (incidents.length === 0) {
    return (
      <div className="bg-vaultbrix-card border border-slate-800 rounded-lg p-6 text-center">
        <div className="text-emerald-400 text-lg mb-2">No incidents reported</div>
        <p className="text-slate-400 text-sm">
          All systems have been operating normally.
        </p>
      </div>
    );
  }

  const severityColors = {
    minor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    major: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const statusColors = {
    resolved: 'text-emerald-400',
    monitoring: 'text-blue-400',
    identified: 'text-amber-400',
    investigating: 'text-orange-400',
  };

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <div
          key={incident.id}
          className="bg-vaultbrix-card border border-slate-800 rounded-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">{incident.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                  <span>{incident.service}</span>
                  <span>•</span>
                  <span>{format(new Date(incident.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-xs rounded border ${
                    severityColors[incident.severity]
                  }`}
                >
                  {incident.severity}
                </span>
                <span className={`text-sm ${statusColors[incident.status]}`}>
                  {incident.status}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-4 space-y-3">
            {incident.updates.map((update, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      i === incident.updates.length - 1
                        ? 'bg-emerald-400'
                        : 'bg-slate-600'
                    }`}
                  />
                  {i < incident.updates.length - 1 && (
                    <div className="w-px flex-1 bg-slate-700 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={statusColors[update.status as keyof typeof statusColors]}>
                      {update.status}
                    </span>
                    <span className="text-slate-500">
                      {formatDistanceToNow(new Date(update.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mt-1">{update.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Resolution time */}
          {incident.resolvedAt && (
            <div className="px-4 py-2 bg-slate-800/50 text-sm text-slate-400">
              Resolved in{' '}
              {Math.round(
                (new Date(incident.resolvedAt).getTime() -
                  new Date(incident.createdAt).getTime()) /
                  60000
              )}{' '}
              minutes
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
