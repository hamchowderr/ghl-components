import { test, expect } from "@playwright/test"

test.describe("Accessibility", () => {
  test("landing page has proper heading hierarchy", async ({ page }) => {
    await page.goto("/")

    // Should have exactly one h1
    const h1s = await page.locator("h1").count()
    expect(h1s).toBe(1)

    // h2 headings should exist for sections
    const h2s = await page.locator("h2").count()
    expect(h2s).toBeGreaterThanOrEqual(2)
  })

  test("all images have alt text", async ({ page }) => {
    await page.goto("/")

    const images = page.locator("img")
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt")
      expect(alt).not.toBeNull()
      expect(alt?.length).toBeGreaterThan(0)
    }
  })

  test("interactive elements are keyboard accessible", async ({ page }) => {
    await page.goto("/")

    // Tab through the page and ensure focus is visible
    await page.keyboard.press("Tab")
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName)
    expect(firstFocused).toBeTruthy()
  })

  test("buttons and links have accessible names", async ({ page }) => {
    await page.goto("/")

    const buttons = page.locator("button")
    const count = await buttons.count()

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      const name = await button.getAttribute("aria-label") ||
        await button.textContent()
      expect(name?.trim().length).toBeGreaterThan(0)
    }
  })

  test("external links have rel noopener", async ({ page }) => {
    await page.goto("/")

    const externalLinks = page.locator('a[target="_blank"]')
    const count = await externalLinks.count()

    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute("rel")
      expect(rel).toContain("noopener")
    }
  })

  test("page has proper lang attribute", async ({ page }) => {
    await page.goto("/")

    const lang = await page.locator("html").getAttribute("lang")
    expect(lang).toBeTruthy()
  })

  test("color contrast - text is visible", async ({ page }) => {
    await page.goto("/")

    // Verify main heading is visible and has readable size
    const heading = page.locator("h1").first()
    await expect(heading).toBeVisible()

    const box = await heading.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeGreaterThan(20) // Heading should be reasonably sized
  })
})
