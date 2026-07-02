import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createProviderReadinessReport } from "./provider-readiness";

describe("provider readiness registry", () => {
  it("classifies providers with missing environment keys", () => {
    const report = createProviderReadinessReport({});
    const openai = report.providers.find((provider) => provider.id === "openai");

    assert.ok(openai);
    assert.equal(openai.status, "missing");
    assert.deepEqual(openai.missingEnvKeys, ["OPENAI_API_KEY"]);
    assert.equal(openai.providerCalled, false);
    assert.equal(openai.liveCallsAllowed, false);
  });

  it("classifies providers with partial environment setup", () => {
    const report = createProviderReadinessReport({
      GOOGLE_ADS_DEVELOPER_TOKEN: "developer-token",
      GOOGLE_ADS_CLIENT_ID: "client-id",
    });
    const googleAds = report.providers.find((provider) => provider.id === "google_ads");

    assert.ok(googleAds);
    assert.equal(googleAds.status, "partial");
    assert.deepEqual(googleAds.configuredEnvKeys, ["GOOGLE_ADS_DEVELOPER_TOKEN", "GOOGLE_ADS_CLIENT_ID"]);
    assert.ok(googleAds.missingEnvKeys.includes("GOOGLE_ADS_CLIENT_SECRET"));
    assert.equal(googleAds.adsCreated, false);
  });

  it("classifies providers with complete environment setup", () => {
    const report = createProviderReadinessReport({
      ATTOM_API_KEY: "attom-key",
    });
    const attom = report.providers.find((provider) => provider.id === "attom");

    assert.ok(attom);
    assert.equal(attom.status, "configured");
    assert.deepEqual(attom.configuredEnvKeys, ["ATTOM_API_KEY"]);
    assert.deepEqual(attom.missingEnvKeys, []);
    assert.equal(attom.enrichmentWritten, false);
  });

  it("keeps OpenStreetMap credential-free and readiness-only", () => {
    const report = createProviderReadinessReport({});
    const openStreetMap = report.providers.find((provider) => provider.id === "openstreetmap");

    assert.ok(openStreetMap);
    assert.equal(openStreetMap.status, "no_credentials_required");
    assert.deepEqual(openStreetMap.requiredEnvKeys, []);
    assert.equal(openStreetMap.providerCalled, false);
    assert.equal(openStreetMap.liveCallsAllowed, false);
  });

  it("treats placeholder values as missing", () => {
    const report = createProviderReadinessReport({
      OPENAI_API_KEY: "replace-with-openai-api-key",
    });
    const openai = report.providers.find((provider) => provider.id === "openai");

    assert.ok(openai);
    assert.equal(openai.status, "missing");
    assert.deepEqual(openai.configuredEnvKeys, []);
  });

  it("blocks live activation and provider calls for every provider", () => {
    const report = createProviderReadinessReport({
      OPENAI_API_KEY: "openai-key",
      GOOGLE_MAPS_API_KEY: "maps-key",
      ATTOM_API_KEY: "attom-key",
    });

    assert.equal(report.providerCalled, false);
    assert.equal(report.liveCallsAllowed, false);
    assert.equal(report.safety.noLiveExternalFetches, true);

    for (const provider of report.providers) {
      assert.equal(provider.activationState, "blocked_readiness_only");
      assert.equal(provider.providerCalled, false);
      assert.equal(provider.liveExecutionAllowed, false);
      assert.equal(provider.liveCallsAllowed, false);
      assert.equal(provider.oauthStarted, false);
      assert.equal(provider.published, false);
      assert.equal(provider.scheduled, false);
      assert.equal(provider.connectorWrite, false);
      assert.equal(provider.adsCreated, false);
      assert.equal(provider.enrichmentWritten, false);
    }
  });

  it("registers LinkedIn Company Page as configured but not connected", () => {
    const report = createProviderReadinessReport({});
    const linkedin = report.providers.find((provider) => provider.id === "linkedin_company_page");

    assert.ok(linkedin);
    assert.equal(linkedin.label, "LinkedIn");
    assert.equal(linkedin.status, "configured");
    assert.equal(linkedin.readiness, "Configured / Not Connected");
    assert.equal(linkedin.connectionState, "not_connected");
    assert.equal(linkedin.publicProfileUrl, "https://www.linkedin.com/company/109661667/");
    assert.equal(linkedin.providerCalled, false);
    assert.equal(linkedin.liveExecutionAllowed, false);
    assert.equal(linkedin.liveCallsAllowed, false);
    assert.equal(linkedin.oauthStarted, false);
    assert.equal(linkedin.published, false);
    assert.equal(linkedin.scheduled, false);
    assert.equal(linkedin.connectorWrite, false);
    assert.equal(linkedin.authenticationRequired, true);
    assert.deepEqual(linkedin.supportedCapabilities, ["company_posts", "image_posts", "article_posts", "analytics (future)"]);
  });
});
