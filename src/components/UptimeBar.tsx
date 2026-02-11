'use client';

export interface DayStatus {
  date: string;
  status: 'up' | 'down' | 'degraded' | 'no-data';
}

interface UptimeBarProps {
  uptime: number;
  dailyHistory?: DayStatus[];
}

export function UptimeBar({ uptime, dailyHistory }: UptimeBarProps) {
  // Generate 90 segments (one per day)
  // Use real history if provided, otherwise default to 'up' (green)
  const segments = Array.from({ length: 90 }, (_, i) => {
    if (dailyHistory && dailyHistory[i]) {
      return dailyHistory[i].status;
    }
    // Default: show green (up) for days without real data
    return 'up';
  });

  return (
    <div className="uptime-bar">
      {segments.map((status, i) => (
        <div
          key={i}
          className={`uptime-bar-segment ${status}`}
          title={`Day ${90 - i}: ${status}`}
        />
      ))}
    </div>
  );
}
