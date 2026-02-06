import { readdir } from "fs/promises"
import { join } from "path"

interface EndpointResult {
  endpoint: string
  status: number
  contentType: string | null
  valid: boolean
  error?: string
}

export async function testEndpoints(
  baseUrl = "http://localhost:3000"
): Promise<{
  success: boolean
  results: EndpointResult[]
}> {
  console.log("\n🌐 Testing registry endpoints...\n")

  const publicRDir = join(process.cwd(), "public", "r")
  const files = await readdir(publicRDir)
  const jsonFiles = files.filter((f) => f.endsWith(".json"))

  const results: EndpointResult[] = []

  for (const file of jsonFiles) {
    const endpoint = `/r/${file}`
    const url = `${baseUrl}${endpoint}`

    try {
      const response = await fetch(url)
      const contentType = response.headers.get("content-type")

      const result: EndpointResult = {
        endpoint,
        status: response.status,
        contentType,
        valid: response.status === 200 && contentType?.includes("application/json") === true,
      }

      if (response.status === 200) {
        // Verify it's valid JSON
        try {
          await response.json()
        } catch {
          result.valid = false
          result.error = "Response is not valid JSON"
        }
      } else {
        result.error = `HTTP ${response.status}`
      }

      results.push(result)

      if (result.valid) {
        console.log(`  ✅ GET ${endpoint} - ${response.status}`)
      } else {
        console.log(`  ❌ GET ${endpoint} - ${result.error || response.status}`)
      }
    } catch (err) {
      results.push({
        endpoint,
        status: 0,
        contentType: null,
        valid: false,
        error: `Fetch failed: ${err}`,
      })
      console.log(`  ❌ GET ${endpoint} - Fetch failed`)
    }
  }

  const success = results.every((r) => r.valid)
  const validCount = results.filter((r) => r.valid).length

  console.log(`\n  Endpoint testing: ${validCount}/${results.length} passed`)

  return { success, results }
}

// Allow running standalone
if (require.main === module) {
  const baseUrl = process.argv[2] || "http://localhost:3000"

  testEndpoints(baseUrl)
    .then((result) => {
      process.exit(result.success ? 0 : 1)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
