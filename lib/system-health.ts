import { prisma } from "@/lib/prisma";

export type SystemHealth = {
  database: "ok" | "error";
  twilio: "configured" | "missing" | "unverified";
  aiOptimization: "on" | "off";
  activeStrategiesCount: number;
  recentFailuresCount: number;
  status: "healthy" | "warning" | "critical";
};

async function getDatabaseHealth(): Promise<SystemHealth["database"]> {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return "ok";
  } catch {
    return "error";
  }
}

export async function getSystemHealth(): Promise<SystemHealth> {
  const database = await getDatabaseHealth();

  return {
    database,
    twilio: "unverified",
    aiOptimization: "off",
    activeStrategiesCount: 0,
    recentFailuresCount: 0,
    status: database === "ok" ? "warning" : "critical"
  };
}
