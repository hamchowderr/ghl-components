import { test, expect } from "@playwright/test"

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("loads successfully with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/GHL Components/i)
  })

  test("displays main heading", async ({ page }) => {
    const heading = page.locator("h1").first()
    await expect(heading).toBeVisible()
    await expect(heading).toContainText("GHL Components")
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

    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes("favicon")
    )

    expect(criticalErrors).toEqual([])
  })

  test("displays the hero section with badge", async ({ page }) => {
    await expect(page.getByText("Open Source Component Registry")).toBeVisible()
  })

  test("displays hero description mentioning GoHighLevel", async ({ page }) => {
    const hero = page.locator("section").first()
    await expect(hero.getByText("GoHighLevel", { exact: true })).toBeVisible()
  })

  test("displays Browse Components button linking to components section", async ({ page }) => {
    const browseButton = page.getByRole("link", { name: /Browse Components/i })
    await expect(browseButton).toBeVisible()
    await expect(browseButton).toHaveAttribute("href", "#components")
  })

  test("displays GitHub button", async ({ page }) => {
    const githubButton = page.getByRole("link", { name: "GitHub", exact: true })
    await expect(githubButton).toBeVisible()
  })

  test("displays install command section", async ({ page }) => {
    const hero = page.locator("section").first()
    await expect(hero.getByText("Get started with a single command")).toBeVisible()
    await expect(hero.getByText(/npx shadcn/)).toBeVisible()
  })

  test("displays 'Why GHL Components?' features section", async ({ page }) => {
    await expect(page.getByText("Why GHL Components?")).toBeVisible()
  })

  test("displays all four feature cards", async ({ page }) => {
    await expect(page.getByText("OAuth Made Simple")).toBeVisible()
    await expect(page.getByText("Secure Webhooks")).toBeVisible()
    await expect(page.getByText("Full TypeScript Support")).toBeVisible()
    await expect(page.getByText("shadcn/ui Pattern")).toBeVisible()
  })

  test("displays Components section with heading", async ({ page }) => {
    const componentsSection = page.locator("#components")
    await expect(componentsSection).toBeVisible()
    await expect(page.getByRole("heading", { name: "Components", exact: true })).toBeVisible()
  })

  test("displays component category tabs", async ({ page }) => {
    await expect(page.getByRole("tab", { name: /All/i })).toBeVisible()
    await expect(page.getByRole("tab", { name: /Auth/i })).toBeVisible()
    await expect(page.getByRole("tab", { name: /Contacts/i })).toBeVisible()
    await expect(page.getByRole("tab", { name: /Calendars/i })).toBeVisible()
    await expect(page.getByRole("tab", { name: /Server/i })).toBeVisible()
  })

  test("displays footer with credit", async ({ page }) => {
    await expect(page.getByText(/Built for the GoHighLevel community/)).toBeVisible()
  })

  test("footer has GitHub link", async ({ page }) => {
    const footerLink = page.locator("footer a")
    await expect(footerLink).toHaveText(/View on GitHub/i)
  })

  test("page is responsive - mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/")

    const heading = page.locator("h1").first()
    await expect(heading).toBeVisible()
    await expect(page.getByText("Why GHL Components?")).toBeVisible()
  })

  test("Browse Components button scrolls to components section", async ({ page }) => {
    const browseButton = page.getByRole("link", { name: /Browse Components/i })
    await browseButton.click()

    const componentsHeading = page.getByRole("heading", { name: "Components", exact: true })
    await expect(componentsHeading).toBeInViewport()
  })
})
