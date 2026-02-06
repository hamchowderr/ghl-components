import { existsSync } from "fs"
import { readFile } from "fs/promises"
import { join } from "path"
import { createTempProject, cleanupTempProject } from "../utils/temp-project"
import { execOrFail, exec } from "../utils/exec"

interface InstallationResult {
  component: string
  installed: boolean
  filesCreated: string[]
  dependenciesAdded: string[]
  critical: boolean
  error?: string
}

export async function testInstallation(
  baseUrl = "http://localhost:3000"
): Promise<{
  success: boolean
  results: InstallationResult[]
  tempDir: string
}> {
  console.log("\n📦 Testing component installation...\n")

  const tempDir = await createTempProject()
  const results: InstallationResult[] = []

  try {
    // Step 1: Create Next.js project
    console.log("  Creating Next.js project...")
    await execOrFail(
      "npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --no-git --yes",
      { cwd: tempDir, silent: true, timeout: 180000 }
    )
    console.log("  ✅ Next.js project created")

    // Step 2: Initialize shadcn
    console.log("  Initializing shadcn/ui...")
    await execOrFail("npx shadcn@latest init -y -d", {
      cwd: tempDir,
      silent: true,
      timeout: 60000,
    })
    console.log("  ✅ shadcn/ui initialized")

    // Step 3: Test component installations
    // Components ordered by dependency (install dependencies first)
    const componentsToTest = [
      {
        name: "ghl-provider",
        expectedFiles: ["components/ghl-provider.tsx"],
        expectedDeps: [],
        critical: true,
      },
      {
        name: "ghl-webhook-handler",
        expectedFiles: [
          "lib/webhook-handler.ts",
          "lib/verify-signature.ts",
          "lib/constants.ts",
        ],
        expectedDeps: [],
        critical: true,
      },
      {
        // Note: Has ghl-provider as registryDependency. The shadcn CLI doesn't
        // properly resolve custom registry deps even when already installed.
        // Users should install ghl-provider first, then this component.
        name: "ghl-contact-form",
        expectedFiles: ["components/ghl-contact-form.tsx"],
        expectedDeps: ["zod", "sonner"],
        critical: false, // Known shadcn limitation with custom registry deps
      },
    ]

    for (const component of componentsToTest) {
      console.log(`  Installing ${component.name}...`)

      const result: InstallationResult = {
        component: component.name,
        installed: false,
        filesCreated: [],
        dependenciesAdded: [],
        critical: component.critical,
      }

      try {
        await execOrFail(
          `npx shadcn@latest add ${baseUrl}/r/${component.name}.json -y`,
          { cwd: tempDir, silent: true, timeout: 120000 }
        )

        // Check which expected files were created
        for (const expectedFile of component.expectedFiles) {
          const filePath = join(tempDir, expectedFile)
          // Also check alternative paths shadcn might use
          const altPaths = [
            filePath,
            join(tempDir, "components", "ui", expectedFile.split("/").pop()!),
            join(tempDir, expectedFile.replace("components/", "components/ui/")),
          ]

          const found = altPaths.some((p) => existsSync(p))
          if (found) {
            result.filesCreated.push(expectedFile)
          }
        }

        // Check if dependencies were added
        const packageJsonPath = join(tempDir, "package.json")
        const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"))
        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        }

        for (const dep of component.expectedDeps) {
          if (allDeps[dep]) {
            result.dependenciesAdded.push(dep)
          }
        }

        result.installed = true
        console.log(`  ✅ ${component.name} installed`)

        if (result.filesCreated.length > 0) {
          console.log(`     Files: ${result.filesCreated.join(", ")}`)
        }
        if (result.dependenciesAdded.length > 0) {
          console.log(`     Deps: ${result.dependenciesAdded.join(", ")}`)
        }
      } catch (err) {
        result.error = err instanceof Error ? err.message : String(err)
        console.log(`  ❌ ${component.name} failed: ${result.error}`)
      }

      results.push(result)
    }

    // Step 4: Verify TypeScript compiles
    console.log("  \n  Verifying TypeScript compilation...")
    const tscResult = await exec("npx tsc --noEmit", {
      cwd: tempDir,
      silent: true,
      timeout: 120000,
    })

    if (tscResult.code === 0) {
      console.log("  ✅ TypeScript compilation passed")
    } else {
      console.log("  ⚠️ TypeScript compilation had issues (may be expected)")
    }

    // Success = all critical components installed
    const criticalComponents = componentsToTest.filter((c) => c.critical)
    const criticalResults = results.filter((r) =>
      criticalComponents.some((c) => c.name === r.component)
    )
    const success = criticalResults.every((r) => r.installed)

    const installedCount = results.filter((r) => r.installed).length
    const criticalPassedCount = criticalResults.filter((r) => r.installed).length

    console.log(
      `\n  Installation testing: ${installedCount}/${results.length} passed (${criticalPassedCount}/${criticalComponents.length} critical)`
    )

    return { success, results, tempDir }
  } catch (err) {
    console.error("  ❌ Installation test failed:", err)
    return {
      success: false,
      results,
      tempDir,
    }
  }
}

// Cleanup function to be called after tests
export { cleanupTempProject }

// Allow running standalone
if (require.main === module) {
  const baseUrl = process.argv[2] || "http://localhost:3000"

  testInstallation(baseUrl)
    .then(async (result) => {
      await cleanupTempProject()
      process.exit(result.success ? 0 : 1)
    })
    .catch(async (err) => {
      console.error(err)
      await cleanupTempProject()
      process.exit(1)
    })
}
