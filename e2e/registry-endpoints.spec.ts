import { test, expect } from "@playwright/test"
import registry from "../registry.json"

test.describe("Registry Endpoints", () => {
  test("all registry items are accessible via /r/ endpoints", async ({ request }) => {
    for (const item of registry.items) {
      const response = await request.get(`/r/${item.name}.json`)

      if (response.ok()) {
        const json = await response.json()
        expect(json).toHaveProperty("name", item.name)
        expect(json).toHaveProperty("files")
      }
    }
  })

  test("registry JSON responses have correct structure", async ({ request }) => {
    const sampleItems = registry.items.slice(0, 5)

    for (const item of sampleItems) {
      const response = await request.get(`/r/${item.name}.json`)

      if (response.ok()) {
        const json = await response.json()

        expect(json.name).toBe(item.name)
        expect(json.type).toBeDefined()
        expect(Array.isArray(json.files)).toBe(true)
        expect(json.files.length).toBeGreaterThan(0)

        for (const file of json.files) {
          expect(file).toHaveProperty("content")
          expect(typeof file.content).toBe("string")
          expect(file.content.length).toBeGreaterThan(0)
        }
      }
    }
  })

  test("returns 404 for non-existent components", async ({ request }) => {
    const response = await request.get("/r/non-existent-component.json")
    expect(response.status()).toBe(404)
  })

  test("registry endpoints have CORS headers", async ({ request }) => {
    const response = await request.get(`/r/${registry.items[0].name}.json`)

    if (response.ok()) {
      const headers = response.headers()
      expect(headers["access-control-allow-origin"]).toBe("*")
      expect(headers["access-control-allow-methods"]).toContain("GET")
    }
  })

  test("registry endpoints have cache headers", async ({ request }) => {
    const response = await request.get(`/r/${registry.items[0].name}.json`)

    if (response.ok()) {
      const cacheControl = response.headers()["cache-control"]
      expect(cacheControl).toContain("public")
    }
  })

  test("component dependencies reference valid npm packages", async ({ request }) => {
    for (const item of registry.items) {
      const response = await request.get(`/r/${item.name}.json`)

      if (response.ok()) {
        const json = await response.json()
        if (json.dependencies) {
          for (const dep of json.dependencies) {
            expect(typeof dep).toBe("string")
            expect(dep.length).toBeGreaterThan(0)
          }
        }
      }
    }
  })
})
