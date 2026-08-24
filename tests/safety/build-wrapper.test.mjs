import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getNextBuildArgs } from "../../scripts/build-with-lock.mjs";

describe("build wrapper platform selection", () => {
  it("uses Webpack on Windows when native Turbopack bindings are not dependable", () => {
    assert.ok(getNextBuildArgs("win32").includes("--webpack"));
  });

  it("preserves default Next build mode on governed Linux CI", () => {
    assert.equal(getNextBuildArgs("linux").includes("--webpack"), false);
  });

  it("allows explicit Webpack override without changing Linux defaults", () => {
    assert.ok(getNextBuildArgs("linux", { NEXT_BUILD_FORCE_WEBPACK: "true" }).includes("--webpack"));
  });

  it("uses Webpack for Vercel builds to avoid Turbopack whole-project Prisma tracing", () => {
    assert.ok(getNextBuildArgs("linux", { VERCEL: "1" }).includes("--webpack"));
  });

  it("allows an explicit Turbopack override for controlled diagnostics", () => {
    assert.ok(!getNextBuildArgs("linux", { VERCEL: "1", NEXT_BUILD_FORCE_TURBOPACK: "true" }).includes("--webpack"));
  });
});
