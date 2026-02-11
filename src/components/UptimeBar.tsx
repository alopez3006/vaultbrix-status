'use client';

interface UptimeBarProps {
  uptime: number;
}

export function UptimeBar({ uptime }: UptimeBarProps) {
  // Generate 90 segments (one per day)
  const segments = Array.from({ length: 90 }, (_, i) => {
    // Simulate historical data based on uptime percentage
    // In production, this would come from actual history
    const random = Math.random() * 100;
    if (random < uptime - 1) return 'up';
    if (random < uptime) return 'degraded';
    return uptime > 95 ? 'up' : 'down';
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
