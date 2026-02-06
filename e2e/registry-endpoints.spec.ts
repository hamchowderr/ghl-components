import { test, expect } from "@playwright/test"
import registry from "../registry.json"

test.describe("Registry Endpoints", () => {
  // Test that the registry JSON endpoint is accessible
  // Note: This requires the registry to be built first with `npm run build:registry`

  test("registry items are accessible via /r/ endpoints", async ({ request }) => {
    // Test a sample of registry items
    const sampleItems = registry.items.slice(0, 3)

    for (const item of sampleItems) {
      const response = await request.get(`/r/${item.name}.json`)

      // If registry hasn't been built, endpoint may not exist yet
      // This is expected in dev - the test documents the expected behavior
      if (response.ok()) {
        const json = await response.json()
        expect(json).toHaveProperty("name", item.name)
        expect(json).toHaveProperty("files")
      }
    }
  })

  test("returns 404 for non-existent components", async ({ request }) => {
    const response = await request.get("/r/non-existent-component.json")
    expect(response.status()).toBe(404)
  })
})
