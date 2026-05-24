import type { StoredLead } from "./leads-storage";
import {
  createManualFollowUpWorkspaceList,
  createManualFollowUpWorkspaceModel,
  createManualFollowUpWorkspaceUsabilitySummary,
  getManualFollowUpWorkspaceMissingData,
  manualFollowUpWorkspaceFlags,
  manualFollowUpWorkspaceLanes,
  type ManualFollowUpWorkspaceLane,
  type ManualFollowUpWorkspaceList,
  type ManualFollowUpWorkspaceModel,
} from "./manual-follow-up-workspace-usability";

export const realManualFollowUpWorkspaceFlags = manualFollowUpWorkspaceFlags;
export const realManualFollowUpWorkspaceLanes = manualFollowUpWorkspaceLanes;

export type RealManualFollowUpWorkspaceLane = ManualFollowUpWorkspaceLane;
export type RealManualFollowUpWorkspaceModel = ManualFollowUpWorkspaceModel;
export type RealManualFollowUpWorkspaceList = ManualFollowUpWorkspaceList;

export function getRealManualFollowUpWorkspaceMissingData(lead: StoredLead) {
  return getManualFollowUpWorkspaceMissingData(lead);
}

export function createRealManualFollowUpWorkspaceModel(lead: StoredLead, now = new Date()) {
  return createManualFollowUpWorkspaceModel(lead, now);
}

export function createRealManualFollowUpWorkspaceList(leads: StoredLead[], now = new Date()) {
  return createManualFollowUpWorkspaceList(leads, now);
}

export function createRealManualFollowUpWorkspaceUsabilitySummary(leads: StoredLead[] = [], now = new Date()) {
  const summary = createManualFollowUpWorkspaceUsabilitySummary(leads, now);

  return {
    ...summary,
    phase: "Real Manual Follow-Up Workspace Usability Consolidation" as const,
    canonicalHelper: "manual-follow-up-workspace-usability",
    duplicateArchitectureCreated: false,
    recommendedNextExactStep: "Dashboard Signal Consolidation",
  };
}
