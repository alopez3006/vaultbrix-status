import { getStatus } from '@/lib/status';
import { getHistory } from '@/lib/history';
import { HistoryChart } from '@/components/HistoryChart';
import { IncidentList } from '@/components/IncidentList';

export default async function HistoryPage() {
  const status = await getStatus();
  const history = await getHistory();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Uptime History</h1>
        <p className="text-slate-400">
          Historical uptime data for all Vaultbrix services over the last 90 days.
        </p>
      </div>

      {/* Overall uptime stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {status.services.map((service) => (
          <div
            key={service.name}
            className="bg-vaultbrix-card border border-slate-800 rounded-lg p-4"
          >
            <div className="text-sm text-slate-400 mb-1">{service.name}</div>
            <div className="text-2xl font-semibold text-emerald-400">
              {service.uptime}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Avg: {service.avgResponseTime}ms
            </div>
          </div>
        ))}
      </div>

      {/* Response time charts */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-slate-300">Response Time (24h)</h2>
        <div className="grid gap-4">
          {status.services.map((service) => (
            <HistoryChart
              key={service.name}
              name={service.name}
              data={history[service.name.toLowerCase().replace(/\s+/g, '-')] || []}
            />
          ))}
        </div>
      </div>

      {/* Past incidents */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-slate-300">Past Incidents</h2>
        <IncidentList incidents={history.incidents || []} />
      </div>
    </div>
  );
}
