import { readdir, readFile } from "fs/promises"
import { join } from "path"

interface RegistryFile {
  path: string
  content: string
  type: string
}

interface RegistryItem {
  $schema?: string
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
}

interface ValidationResult {
  file: string
  valid: boolean
  errors: string[]
}

export async function validateSchemas(): Promise<{
  success: boolean
  results: ValidationResult[]
}> {
  console.log("\n📋 Validating registry JSON schemas...\n")

  const publicRDir = join(process.cwd(), "public", "r")
  const files = await readdir(publicRDir)
  const jsonFiles = files.filter(
    (f) => f.endsWith(".json") && f !== "registry.json"
  )

  const results: ValidationResult[] = []

  for (const file of jsonFiles) {
    const filePath = join(publicRDir, file)
    const result = await validateRegistryItem(filePath, file)
    results.push(result)

    if (result.valid) {
      console.log(`  ✅ ${file}`)
    } else {
      console.log(`  ❌ ${file}`)
      result.errors.forEach((err) => console.log(`     - ${err}`))
    }
  }

  const success = results.every((r) => r.valid)
  const validCount = results.filter((r) => r.valid).length

  console.log(`\n  Schema validation: ${validCount}/${results.length} passed`)

  return { success, results }
}

async function validateRegistryItem(
  filePath: string,
  fileName: string
): Promise<ValidationResult> {
  const errors: string[] = []

  try {
    const content = await readFile(filePath, "utf-8")
    let item: RegistryItem

    try {
      item = JSON.parse(content)
    } catch {
      return { file: fileName, valid: false, errors: ["Invalid JSON"] }
    }

    // Check required fields
    if (!item.name) {
      errors.push("Missing required field: name")
    }

    if (!item.type) {
      errors.push("Missing required field: type")
    } else if (
      !["registry:component", "registry:lib", "registry:page", "registry:block"].includes(
        item.type
      )
    ) {
      errors.push(`Invalid type: ${item.type}`)
    }

    if (!item.files || !Array.isArray(item.files)) {
      errors.push("Missing required field: files (must be array)")
    } else if (item.files.length === 0) {
      errors.push("files array is empty")
    } else {
      // Validate each file entry
      for (let i = 0; i < item.files.length; i++) {
        const file = item.files[i]

        if (!file.path) {
          errors.push(`files[${i}]: missing path`)
        }

        if (!file.content) {
          errors.push(`files[${i}]: missing content`)
        } else if (typeof file.content !== "string") {
          errors.push(`files[${i}]: content must be a string`)
        } else if (file.content.length < 10) {
          errors.push(`files[${i}]: content seems too short`)
        }

        if (!file.type) {
          errors.push(`files[${i}]: missing type`)
        }
      }
    }

    // Validate dependencies are arrays if present
    if (item.dependencies && !Array.isArray(item.dependencies)) {
      errors.push("dependencies must be an array")
    }

    if (item.registryDependencies && !Array.isArray(item.registryDependencies)) {
      errors.push("registryDependencies must be an array")
    }

    // Check that content looks like valid TypeScript/JavaScript
    if (item.files && item.files.length > 0) {
      const firstFile = item.files[0]
      if (firstFile.content) {
        // Should start with imports, "use client", or exports
        const contentStart = firstFile.content.trim().substring(0, 100)
        const validStarts = [
          '"use client"',
          "'use client'",
          "import ",
          "export ",
          "//",
          "/*",
          "type ",
          "interface ",
          "const ",
        ]

        if (!validStarts.some((start) => contentStart.startsWith(start))) {
          errors.push(
            `files[0]: content doesn't look like valid TypeScript (starts with: ${contentStart.substring(0, 30)}...)`
          )
        }
      }
    }

    return { file: fileName, valid: errors.length === 0, errors }
  } catch (err) {
    return {
      file: fileName,
      valid: false,
      errors: [`Failed to read file: ${err}`],
    }
  }
}

// Allow running standalone
if (require.main === module) {
  validateSchemas()
    .then((result) => {
      process.exit(result.success ? 0 : 1)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
