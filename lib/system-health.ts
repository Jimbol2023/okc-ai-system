export type SystemHealth = {
  database: "ok" | "error";
  twilio: "configured" | "missing" | "unverified";
  aiOptimization: "on" | "off";
  activeStrategiesCount: number;
  recentFailuresCount: number;
  status: "healthy" | "warning" | "critical";
};

export async function getSystemHealth(): Promise<SystemHealth> {
  return {
    database: "error",
    twilio: "unverified",
    aiOptimization: "off",
    activeStrategiesCount: 0,
    recentFailuresCount: 0,
    status: "warning"
  };
}
