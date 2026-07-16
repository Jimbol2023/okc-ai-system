import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchMarketIntelligenceDashboard } from "./search-market-intelligence-dashboard";

const mockReport = {
  schemaVersion: "search-market-intelligence-read-v1",
  tenantId: "storybook-tenant",
  cases: [],
  latestMonday: null,
  summary: { active: 0, qaRequired: 0, executiveReview: 0 },
  promotionState: "calibration_ready",
  providerCalled: false,
  externalWritesAllowed: false,
  liveExecutionAllowed: false,
};

const meta = { title: "Search Intelligence/Professional Workspace", component: SearchMarketIntelligenceDashboard, parameters: { viewport: { defaultViewport: "responsive" } }, args: { report: mockReport as never } } satisfies Meta<typeof SearchMarketIntelligenceDashboard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const EmptyEvidence: Story = {};
export const Mobile: Story = { parameters: { viewport: { defaultViewport: "mobile1" } } };
