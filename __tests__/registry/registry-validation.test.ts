import { describe, it, expect } from "vitest"
import fs from "fs"
import path from "path"

const REGISTRY_PATH = path.resolve(__dirname, "../../registry.json")

interface RegistryFile {
  path: string
  type: string
}

interface RegistryItem {
  name: string
  type: string
  title: string
  description: string
  dependencies: string[]
  registryDependencies: string[]
  files: RegistryFile[]
}

interface Registry {
  $schema: string
  name: string
  homepage: string
  items: RegistryItem[]
}

describe("Registry Validation", () => {
  let registry: Registry

  it("registry.json is valid JSON", () => {
    const content = fs.readFileSync(REGISTRY_PATH, "utf-8")
    expect(() => JSON.parse(content)).not.toThrow()
    registry = JSON.parse(content)
  })

  it("has required top-level fields", () => {
    const content = fs.readFileSync(REGISTRY_PATH, "utf-8")
    registry = JSON.parse(content)

    expect(registry.$schema).toBe("https://ui.shadcn.com/schema/registry.json")
    expect(registry.name).toBe("ghl-components")
    expect(registry.homepage).toBeDefined()
    expect(Array.isArray(registry.items)).toBe(true)
  })

  it("all declared files exist on disk", () => {
    const content = fs.readFileSync(REGISTRY_PATH, "utf-8")
    registry = JSON.parse(content)

    const missingFiles: string[] = []

    for (const item of registry.items) {
      for (const file of item.files) {
        const filePath = path.resolve(__dirname, "../..", file.path)
        if (!fs.existsSync(filePath)) {
          missingFiles.push(`${item.name}: ${file.path}`)
        }
      }
    }

    expect(missingFiles).toEqual([])
  })

  it("all ghl-* components have required fields", () => {
    const content = fs.readFileSync(REGISTRY_PATH, "utf-8")
    registry = JSON.parse(content)

    const invalidItems: string[] = []

    for (const item of registry.items) {
      if (!item.name || typeof item.name !== "string") {
        invalidItems.push(`Missing name`)
        continue
      }
      if (!item.type) {
        invalidItems.push(`${item.name}: missing type`)
      }
      if (!item.title) {
        invalidItems.push(`${item.name}: missing title`)
      }
      if (!item.description) {
        invalidItems.push(`${item.name}: missing description`)
      }
      if (!Array.isArray(item.files) || item.files.length === 0) {
        invalidItems.push(`${item.name}: missing or empty files array`)
      }
    }

    expect(invalidItems).toEqual([])
  })

  it("ghl-* component names follow naming convention", () => {
    const content = fs.readFileSync(REGISTRY_PATH, "utf-8")
    registry = JSON.parse(content)

    const invalidNames: string[] = []

    for (const item of registry.items) {
      // GHL components should start with "ghl-"
      if (!item.name.startsWith("ghl-")) {
        invalidNames.push(item.name)
      }
    }

    expect(invalidNames).toEqual([])
  })

  it("all registryDependencies reference existing items", () => {
    const content = fs.readFileSync(REGISTRY_PATH, "utf-8")
    registry = JSON.parse(content)

    const itemNames = new Set(registry.items.map((item) => item.name))
    // shadcn base components that are valid dependencies
    const shadcnComponents = new Set([
      "button",
      "card",
      "input",
      "label",
      "switch",
      "badge",
      "alert",
      "command",
      "popover",
      "skeleton",
      "scroll-area",
      "pagination",
      "dialog",
      "select",
      "avatar",
      "dropdown-menu",
      "calendar",
      "textarea",
      "tabs",
    ])

    const invalidDeps: string[] = []

    for (const item of registry.items) {
      for (const dep of item.registryDependencies) {
        if (!itemNames.has(dep) && !shadcnComponents.has(dep)) {
          invalidDeps.push(`${item.name} -> ${dep}`)
        }
      }
    }

    expect(invalidDeps).toEqual([])
  })
})
