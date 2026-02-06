#!/usr/bin/env npx tsx

import { existsSync } from "fs"
import { readdir } from "fs/promises"
import { join } from "path"
import { execOrFail } from "./utils/exec"
import { startDevServer, waitForServer, stopServer, killPort } from "./utils/server"
import { validateSchemas } from "./tests/validate-schema"
import { testEndpoints } from "./tests/test-endpoints"
import { testInstallation, cleanupTempProject } from "./tests/test-installation"

const BASE_URL = "http://localhost:3000"

interface TestResults {
  build: boolean
  schema: boolean
  endpoints: boolean
  installation: boolean
}

async function main(): Promise<void> {
  console.log("━".repeat(50))
  console.log("  GHL Components Registry Test Suite")
  console.log("━".repeat(50))

  const results: TestResults = {
    build: false,
    schema: false,
    endpoints: false,
    installation: false,
  }

  try {
    // ═══════════════════════════════════════════════════
    // PHASE 1: BUILD REGISTRY
    // ═══════════════════════════════════════════════════
    console.log("\n🔨 Phase 1: Building registry...\n")

    await execOrFail("npm run build:registry", { silent: false })

    // Validate build outputs
    const publicRDir = join(process.cwd(), "public", "r")
    if (!existsSync(publicRDir)) {
      throw new Error("Build failed: public/r directory not created")
    }

    const files = await readdir(publicRDir)
    const jsonFiles = files.filter((f) => f.endsWith(".json"))

    if (jsonFiles.length === 0) {
      throw new Error("Build failed: no JSON files in public/r")
    }

    console.log(`\n✅ Registry built (${jsonFiles.length} components)`)
    results.build = true

    // ═══════════════════════════════════════════════════
    // PHASE 2: START DEV SERVER
    // ═══════════════════════════════════════════════════
    console.log("\n🚀 Phase 2: Starting dev server...\n")

    // Kill any existing process on port 3000
    await killPort(3000)

    await startDevServer()
    await waitForServer(BASE_URL)

    // ═══════════════════════════════════════════════════
    // PHASE 3: RUN TESTS IN PARALLEL
    // ═══════════════════════════════════════════════════
    console.log("\n📋 Phase 3: Running tests in parallel...\n")

    // Run schema validation and endpoint tests in parallel
    // Installation test runs separately as it takes longer
    const [schemaResult, endpointResult] = await Promise.all([
      validateSchemas(),
      testEndpoints(BASE_URL),
    ])

    results.schema = schemaResult.success
    results.endpoints = endpointResult.success

    // Run installation test (takes longer, runs after quick tests)
    const installResult = await testInstallation(BASE_URL)
    results.installation = installResult.success

    // ═══════════════════════════════════════════════════
    // PHASE 4: CLEANUP & REPORT
    // ═══════════════════════════════════════════════════
    console.log("\n🧹 Phase 4: Cleanup...\n")

    await cleanupTempProject()
    stopServer()

    // Final report
    console.log("\n" + "━".repeat(50))
    console.log("  TEST RESULTS")
    console.log("━".repeat(50))

    const allPassed = Object.values(results).every(Boolean)

    console.log(`  Build:        ${results.build ? "✅ Passed" : "❌ Failed"}`)
    console.log(`  Schema:       ${results.schema ? "✅ Passed" : "❌ Failed"}`)
    console.log(
      `  Endpoints:    ${results.endpoints ? "✅ Passed" : "❌ Failed"}`
    )
    console.log(
      `  Installation: ${results.installation ? "✅ Passed" : "❌ Failed"}`
    )

    console.log("━".repeat(50))

    if (allPassed) {
      console.log("  ✅ ALL TESTS PASSED!")
      console.log("━".repeat(50))
      console.log("\n  Next steps:")
      console.log("    1. Deploy to Vercel: vercel deploy")
      console.log("    2. Test production: npm run test:registry:endpoints -- https://ghl-components.vercel.app")
      console.log("")
    } else {
      console.log("  ❌ SOME TESTS FAILED")
      console.log("━".repeat(50))
    }

    process.exit(allPassed ? 0 : 1)
  } catch (err) {
    console.error("\n❌ Test suite failed:", err)
    stopServer()
    await cleanupTempProject()
    process.exit(1)
  }
}

// Run main
main()
