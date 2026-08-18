import { getExecutiveAutonomyLevel1Status } from "@/lib/executive-autonomy-level-1";

type StatusRouteDeps = {
  getStatus: typeof getExecutiveAutonomyLevel1Status;
};

let routeDeps: StatusRouteDeps = {
  getStatus: getExecutiveAutonomyLevel1Status,
};

export function getExecutiveAutonomyStatusRouteDeps() {
  return routeDeps;
}

export function setExecutiveAutonomyStatusRouteDepsForTest(testDeps: Partial<StatusRouteDeps>) {
  const previous = routeDeps;
  routeDeps = { ...routeDeps, ...testDeps };

  return () => {
    routeDeps = previous;
  };
}
