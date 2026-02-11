export interface Service {
  name: string;
  url: string;
  status: 'up' | 'down' | 'degraded';
  code: number;
  responseTime: number;
  uptime: number;
  avgResponseTime: number;
}

export interface Status {
  lastUpdated: string;
  overall: 'up' | 'degraded' | 'down';
  services: Service[];
}

// Default status when no data available
const defaultStatus: Status = {
  lastUpdated: new Date().toISOString(),
  overall: 'up',
  services: [
    {
      name: 'API',
      url: 'https://api.vaultbrix.com/health',
      status: 'up',
      code: 200,
      responseTime: 45,
      uptime: 99.98,
      avgResponseTime: 42,
    },
    {
      name: 'Dashboard',
      url: 'https://app.vaultbrix.com',
      status: 'up',
      code: 200,
      responseTime: 120,
      uptime: 99.95,
      avgResponseTime: 115,
    },
    {
      name: 'Website',
      url: 'https://vaultbrix.com',
      status: 'up',
      code: 200,
      responseTime: 89,
      uptime: 99.99,
      avgResponseTime: 85,
    },
    {
      name: 'Auth Service',
      url: 'https://api.vaultbrix.com/v1/auth/health',
      status: 'up',
      code: 200,
      responseTime: 38,
      uptime: 99.97,
      avgResponseTime: 35,
    },
  ],
};

export async function getStatus(): Promise<Status> {
  // Import status data at build time
  // This file is updated by GitHub Actions every 5 minutes
  try {
    const statusData = await import('../../api/status.json');
    return statusData as unknown as Status;
  } catch {
    // Fallback to default status if file doesn't exist
    return defaultStatus;
  }
}
