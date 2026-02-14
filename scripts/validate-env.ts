/**
 * Environment Variable Validation Script
 *
 * Validates that all required environment variables are present,
 * properly formatted, and free of common issues like trailing spaces,
 * hidden characters, or malformed URLs.
 *
 * Usage: npx tsx scripts/validate-env.ts
 */

import fs from "fs"
import path from "path"

interface EnvVar {
  name: string
  required: boolean
  serverOnly: boolean
  format?: "url" | "alphanumeric" | "string"
  description: string
}

const ENV_VARS: EnvVar[] = [
  {
    name: "NEXT_PUBLIC_GHL_CLIENT_ID",
    required: true,
    serverOnly: false,
    format: "alphanumeric",
    description: "GHL Marketplace App Client ID",
  },
  {
    name: "GHL_CLIENT_SECRET",
    required: true,
    serverOnly: true,
    format: "alphanumeric",
    description: "GHL Marketplace App Client Secret",
  },
  {
    name: "NEXT_PUBLIC_GHL_REDIRECT_URI",
    required: true,
    serverOnly: false,
    format: "url",
    description: "OAuth redirect URI",
  },
  {
    name: "GHL_LOCATION_ID",
    required: false,
    serverOnly: true,
    format: "alphanumeric",
    description: "GHL Location/Sub-Account ID",
  },
]

interface ValidationResult {
  name: string
  status: "ok" | "warning" | "error"
  message: string
}

function validateEnvValue(
  name: string,
  value: string | undefined,
  config: EnvVar
): ValidationResult[] {
  const results: ValidationResult[] = []

  // Check if required var is missing
  if (!value) {
    if (config.required) {
      results.push({ name, status: "error", message: "Required but not set" })
    } else {
      results.push({ name, status: "warning", message: "Optional, not set" })
    }
    return results
  }

  // Check for trailing/leading whitespace
  if (value !== value.trim()) {
    results.push({
      name,
      status: "error",
      message: "Has leading or trailing whitespace",
    })
  }

  // Check for hidden newlines
  if (/[\r\n]/.test(value)) {
    results.push({
      name,
      status: "error",
      message: "Contains hidden newline characters",
    })
  }

  // Check for zero-width characters
  if (/[\u200B\u200C\u200D\uFEFF\u00A0]/.test(value)) {
    results.push({
      name,
      status: "error",
      message: "Contains invisible unicode characters",
    })
  }

  // Check for wrapping quotes (common mistake in .env files)
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    results.push({
      name,
      status: "warning",
      message: "Value is wrapped in quotes (usually not needed in .env files)",
    })
  }

  // Format-specific checks
  if (config.format === "url") {
    if (!value.startsWith("https://") && !value.startsWith("http://")) {
      results.push({
        name,
        status: "error",
        message: "URL must include protocol (https://)",
      })
    }
    if (value.endsWith("/")) {
      results.push({
        name,
        status: "warning",
        message: "URL has trailing slash (may cause issues)",
      })
    }
    try {
      new URL(value)
    } catch {
      results.push({ name, status: "error", message: "Invalid URL format" })
    }
  }

  // Check server-only vars aren't prefixed with NEXT_PUBLIC_
  if (config.serverOnly && name.startsWith("NEXT_PUBLIC_")) {
    results.push({
      name,
      status: "error",
      message:
        "Server-only secret is prefixed with NEXT_PUBLIC_ (exposed to browser!)",
    })
  }

  if (results.length === 0) {
    results.push({ name, status: "ok", message: "Valid" })
  }

  return results
}

function parseEnvFile(filepath: string): Record<string, string> {
  const vars: Record<string, string> = {}
  if (!fs.existsSync(filepath)) return vars

  const content = fs.readFileSync(filepath, "utf-8")
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eqIndex = trimmed.indexOf("=")
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex)
    const value = trimmed.slice(eqIndex + 1)
    vars[key] = value
  }
  return vars
}

function main() {
  console.log("Environment Variable Validation")
  console.log("================================\n")

  // Try to load .env.local, then .env
  const envLocalPath = path.resolve(process.cwd(), ".env.local")
  const envPath = path.resolve(process.cwd(), ".env")

  let envVars: Record<string, string> = {}
  let envSource = "process.env"

  if (fs.existsSync(envLocalPath)) {
    envVars = parseEnvFile(envLocalPath)
    envSource = ".env.local"
  } else if (fs.existsSync(envPath)) {
    envVars = parseEnvFile(envPath)
    envSource = ".env"
  }

  // Merge with process.env (process.env takes precedence)
  const mergedVars = { ...envVars }
  for (const v of ENV_VARS) {
    if (process.env[v.name]) {
      mergedVars[v.name] = process.env[v.name]!
    }
  }

  console.log(`Source: ${envSource}\n`)

  let hasErrors = false
  let hasWarnings = false

  for (const config of ENV_VARS) {
    const value = mergedVars[config.name]
    const results = validateEnvValue(config.name, value, config)

    for (const result of results) {
      const icon =
        result.status === "ok"
          ? "  [OK]"
          : result.status === "warning"
            ? "  [WARN]"
            : "  [ERROR]"
      console.log(`${icon} ${result.name}: ${result.message}`)

      if (result.status === "error") hasErrors = true
      if (result.status === "warning") hasWarnings = true
    }
  }

  // Check for .env.example existence
  const examplePath = path.resolve(process.cwd(), ".env.example")
  console.log("")
  if (fs.existsSync(examplePath)) {
    console.log("  [OK] .env.example exists")
  } else {
    console.log("  [WARN] .env.example is missing")
    hasWarnings = true
  }

  console.log("\n================================")
  if (hasErrors) {
    console.log("RESULT: FAILED - Fix errors above before deploying")
    process.exit(1)
  } else if (hasWarnings) {
    console.log("RESULT: PASSED with warnings")
  } else {
    console.log("RESULT: PASSED - All variables valid")
  }
}

main()
