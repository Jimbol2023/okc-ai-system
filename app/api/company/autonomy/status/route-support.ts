import { getAuthenticatedRequestContext } from "@/lib/auth";
import { getAutonomyStatus } from "@/lib/autonomous-lead-qualification";

type StatusRouteDeps = {
  getAuth: typeof getAuthenticatedRequestContext;
  getStatus: typeof getAutonomyStatus;
};

let routeDeps: StatusRouteDeps = {
  getAuth: getAuthenticatedRequestContext,
  getStatus: getAutonomyStatus,
};

export function getAutonomyStatusRouteDeps() {
  return routeDeps;
}

export function setAutonomyStatusRouteDepsForTest(deps: Partial<StatusRouteDeps>) {
  const previous = routeDeps;
  routeDeps = { ...routeDeps, ...deps };
  return () => {
    routeDeps = previous;
  };
}
