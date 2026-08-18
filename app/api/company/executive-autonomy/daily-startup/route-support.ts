import { runExecutiveDailyStartup } from "@/lib/executive-autonomy-level-1";
import { week1Level1ReadOnlyCategories } from "@/lib/read-only-business-connections";

type DailyStartupRouteDeps = {
  runDailyStartup: typeof runExecutiveDailyStartup;
};

let routeDeps: DailyStartupRouteDeps = {
  runDailyStartup: runExecutiveDailyStartup,
};

export const dailyStartupInternalCategories = week1Level1ReadOnlyCategories;

export function getExecutiveAutonomyDailyStartupRouteDeps() {
  return routeDeps;
}

export function setExecutiveAutonomyDailyStartupRouteDepsForTest(testDeps: Partial<DailyStartupRouteDeps>) {
  const previous = routeDeps;
  routeDeps = { ...routeDeps, ...testDeps };

  return () => {
    routeDeps = previous;
  };
}
