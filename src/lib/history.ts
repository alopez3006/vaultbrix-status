export interface HistoryEntry {
  timestamp: string;
  status: 'up' | 'down' | 'degraded';
  code: number;
  responseTime: number;
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  status: 'resolved' | 'investigating' | 'identified' | 'monitoring';
  severity: 'minor' | 'major' | 'critical';
  createdAt: string;
  resolvedAt?: string;
  updates: {
    timestamp: string;
    status: string;
    message: string;
  }[];
}

export interface History {
  [serviceName: string]: HistoryEntry[];
  incidents?: Incident[];
}

// Default history data (simulated for demo)
function generateMockHistory(): History {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;

  const generateServiceHistory = (avgResponseTime: number): HistoryEntry[] => {
    return Array.from({ length: 24 }, (_, i) => {
      const variation = Math.random() * 30 - 15;
      return {
        timestamp: new Date(now - (23 - i) * hourMs).toISOString(),
        status: 'up' as const,
        code: 200,
        responseTime: Math.round(avgResponseTime + variation),
      };
    });
  };

  return {
    'api': generateServiceHistory(45),
    'dashboard': generateServiceHistory(120),
    'website': generateServiceHistory(85),
    'auth-service': generateServiceHistory(38),
    incidents: [
      {
        id: 'inc-001',
        title: 'Elevated API Response Times',
        service: 'API',
        status: 'resolved',
        severity: 'minor',
        createdAt: '2026-02-08T14:30:00Z',
        resolvedAt: '2026-02-08T15:15:00Z',
        updates: [
          {
            timestamp: '2026-02-08T14:30:00Z',
            status: 'investigating',
            message: 'We are investigating reports of slow API responses.',
          },
          {
            timestamp: '2026-02-08T14:45:00Z',
            status: 'identified',
            message: 'The issue has been identified as a database connection pool exhaustion.',
          },
          {
            timestamp: '2026-02-08T15:15:00Z',
            status: 'resolved',
            message: 'The issue has been resolved. Connection pool limits have been increased.',
          },
        ],
      },
      {
        id: 'inc-002',
        title: 'Scheduled Maintenance',
        service: 'All Services',
        status: 'resolved',
        severity: 'minor',
        createdAt: '2026-02-05T02:00:00Z',
        resolvedAt: '2026-02-05T02:30:00Z',
        updates: [
          {
            timestamp: '2026-02-05T02:00:00Z',
            status: 'monitoring',
            message: 'Scheduled maintenance has begun. Some services may be briefly unavailable.',
          },
          {
            timestamp: '2026-02-05T02:30:00Z',
            status: 'resolved',
            message: 'Maintenance completed successfully. All services are operational.',
          },
        ],
      },
    ],
  };
}

export async function getHistory(): Promise<History> {
  // In production, this would read from history/*.json files
  // For now, return mock data
  try {
    const historyData = await import('../../history/history.json');
    return historyData as unknown as History;
  } catch {
    // Return mock history if file doesn't exist
    return generateMockHistory();
  }
}
