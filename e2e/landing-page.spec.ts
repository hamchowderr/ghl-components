import { test, expect } from "@playwright/test"

test.describe("Landing Page", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/")

    // Page should load without errors
    await expect(page).toHaveTitle(/GHL Components/i)
  })

  test("displays main heading", async ({ page }) => {
    await page.goto("/")

    // Check for main content
    const heading = page.locator("h1").first()
    await expect(heading).toBeVisible()
  })

  test("has no console errors on load", async ({ page }) => {
    const consoleErrors: string[] = []

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // Filter out known acceptable errors (e.g., favicon 404)
    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes("favicon")
    )

    expect(criticalErrors).toEqual([])
  })
})
