import { rm, mkdir } from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"
import { randomBytes } from "crypto"

let tempProjectPath: string | null = null

export async function createTempProject(): Promise<string> {
  // Generate a lowercase random suffix (npm doesn't allow capital letters in project names)
  const suffix = randomBytes(6).toString("hex").toLowerCase()
  const projectName = `ghl-test-${suffix}`

  // Create in a subdirectory to avoid Windows temp path case issues
  const baseDir = join(tmpdir(), "ghl-registry-tests")
  await mkdir(baseDir, { recursive: true })

  tempProjectPath = join(baseDir, projectName)
  await mkdir(tempProjectPath, { recursive: true })

  console.log(`📁 Created temp project at ${tempProjectPath}`)
  return tempProjectPath
}

export async function cleanupTempProject(): Promise<void> {
  if (tempProjectPath) {
    console.log(`🧹 Cleaning up temp project...`)
    try {
      await rm(tempProjectPath, { recursive: true, force: true })
      console.log(`✅ Removed ${tempProjectPath}`)
    } catch (err) {
      console.warn(`⚠️ Failed to cleanup temp project: ${err}`)
    }
    tempProjectPath = null
  }
}

export function getTempProjectPath(): string | null {
  return tempProjectPath
}
