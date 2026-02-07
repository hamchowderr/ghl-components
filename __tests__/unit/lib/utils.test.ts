import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("handles conditional classes", () => {
    const shouldInclude = true
    const shouldExclude = false
    expect(cn("base", shouldInclude && "included", shouldExclude && "excluded")).toBe(
      "base included"
    )
  })

  it("merges tailwind classes correctly", () => {
    // Later classes should override earlier ones
    expect(cn("p-4", "p-2")).toBe("p-2")
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("handles arrays of classes", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz")
  })

  it("handles undefined and null", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar")
  })

  it("handles empty strings", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar")
  })

  it("handles object syntax", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz")
  })
})
