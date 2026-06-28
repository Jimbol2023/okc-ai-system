import { apiError } from "@/lib/api-response";
import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createWorkflowOrchestrationReadinessReport } from "@/lib/workflow-orchestration-readiness";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    return Response.json(createWorkflowOrchestrationReadinessReport());
  } catch (error) {
    console.error("GET /api/workflow-orchestration-readiness failed:", error);

    return apiError("Unable to load workflow orchestration readiness.", 500);
  }
}
