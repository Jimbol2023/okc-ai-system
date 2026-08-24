import { getExecutiveAutonomyLevel1Status, runExecutiveDailyStartup } from "@/lib/executive-autonomy-level-1";

type DailyStartupRouteDeps = {
  runDailyStartup: typeof runExecutiveDailyStartup;
};

type StatusRouteDeps = {
  getStatus: typeof getExecutiveAutonomyLevel1Status;
};

let dailyStartupRouteDeps: DailyStartupRouteDeps = {
  runDailyStartup: runExecutiveDailyStartup,
};

let statusRouteDeps: StatusRouteDeps = {
  getStatus: getExecutiveAutonomyLevel1Status,
};

export function getExecutiveAutonomyDailyStartupRouteDeps() {
  return dailyStartupRouteDeps;
}

export function getExecutiveAutonomyStatusRouteDeps() {
  return statusRouteDeps;
}

export function setExecutiveAutonomyDailyStartupRouteDepsForTest(testDeps: Partial<DailyStartupRouteDeps>) {
  const previous = dailyStartupRouteDeps;
  dailyStartupRouteDeps = { ...dailyStartupRouteDeps, ...testDeps };

  return () => {
    dailyStartupRouteDeps = previous;
  };
}

export function setExecutiveAutonomyStatusRouteDepsForTest(testDeps: Partial<StatusRouteDeps>) {
  const previous = statusRouteDeps;
  statusRouteDeps = { ...statusRouteDeps, ...testDeps };

  return () => {
    statusRouteDeps = previous;
  };
}
