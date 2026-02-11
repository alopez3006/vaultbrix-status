import { StatusCard } from '@/components/StatusCard';
import { OverallStatus } from '@/components/OverallStatus';
import { getStatus } from '@/lib/status';

export default async function StatusPage() {
  const status = await getStatus();

  return (
    <div className="space-y-8">
      <OverallStatus status={status.overall} lastUpdated={status.lastUpdated} />

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-slate-300">Services</h2>
        <div className="space-y-3">
          {status.services.map((service) => (
            <StatusCard key={service.name} service={service} />
          ))}
        </div>
      </div>

      <div className="bg-vaultbrix-card border border-slate-800 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">About This Page</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          This page displays the current operational status of Vaultbrix services.
          We monitor our endpoints every 5 minutes and display the results here.
          If you're experiencing issues not reflected on this page, please contact
          support at <a href="mailto:support@vaultbrix.com" className="text-emerald-400 hover:underline">support@vaultbrix.com</a>.
        </p>
      </div>
    </div>
  );
}
