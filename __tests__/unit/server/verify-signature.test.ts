import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import crypto from "crypto"

// Mock the constants module
vi.mock("@/registry/new-york/server/constants", () => ({
  GHL_PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0test1234567890
-----END PUBLIC KEY-----`,
}))

// We'll test the signature verification logic directly
describe("verifyGHLSignature", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it("returns false when signature is missing", async () => {
    const { verifyGHLSignature } = await import(
      "@/registry/new-york/server/verify-signature"
    )

    expect(verifyGHLSignature("payload", undefined)).toBe(false)
    expect(verifyGHLSignature("payload", null)).toBe(false)
    expect(verifyGHLSignature("payload", "")).toBe(false)
  })

  it("returns false for invalid signature format", async () => {
    const { verifyGHLSignature } = await import(
      "@/registry/new-york/server/verify-signature"
    )

    // Invalid base64 signature should fail
    expect(verifyGHLSignature("payload", "not-valid-base64!!!")).toBe(false)
  })

  it("verifyGHLSignatureWithDetails returns detailed errors", async () => {
    const { verifyGHLSignatureWithDetails } = await import(
      "@/registry/new-york/server/verify-signature"
    )

    // Missing signature
    let result = verifyGHLSignatureWithDetails("payload", undefined)
    expect(result.isValid).toBe(false)
    expect(result.error).toContain("Missing")

    // Empty payload
    result = verifyGHLSignatureWithDetails("", "some-signature")
    expect(result.isValid).toBe(false)
    expect(result.error).toContain("Empty payload")
  })
})

describe("RSA-SHA256 signature verification concept", () => {
  it("demonstrates RSA signature verification works", () => {
    // Generate a test key pair
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    })

    const payload = JSON.stringify({ event: "ContactCreate", data: {} })

    // Sign the payload
    const signer = crypto.createSign("SHA256")
    signer.update(payload)
    const signature = signer.sign(privateKey, "base64")

    // Verify the signature
    const verifier = crypto.createVerify("SHA256")
    verifier.update(payload)
    const isValid = verifier.verify(publicKey, signature, "base64")

    expect(isValid).toBe(true)
  })

  it("detects tampered payloads", () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    })

    const originalPayload = JSON.stringify({ event: "ContactCreate", id: "123" })
    const tamperedPayload = JSON.stringify({ event: "ContactCreate", id: "456" })

    // Sign the original payload
    const signer = crypto.createSign("SHA256")
    signer.update(originalPayload)
    const signature = signer.sign(privateKey, "base64")

    // Try to verify with tampered payload
    const verifier = crypto.createVerify("SHA256")
    verifier.update(tamperedPayload)
    const isValid = verifier.verify(publicKey, signature, "base64")

    expect(isValid).toBe(false)
  })
})
