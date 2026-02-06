import crypto from "crypto"
import { GHL_PUBLIC_KEY } from "./constants"

/**
 * Verify the signature of a GHL webhook payload
 * GHL uses RSA-SHA256 signatures, not HMAC.
 */
export function verifyGHLSignature(
  payload: string,
  signature: string | undefined | null
): boolean {
  if (!signature) {
    console.error("[GHL Webhook] Missing signature header")
    return false
  }

  try {
    const verifier = crypto.createVerify("SHA256")
    verifier.update(payload)
    verifier.end()
    return verifier.verify(GHL_PUBLIC_KEY, signature, "base64")
  } catch (error) {
    console.error("[GHL Webhook] Signature verification error:", error)
    return false
  }
}

/**
 * Verify signature with detailed error reporting
 */
export function verifyGHLSignatureWithDetails(
  payload: string,
  signature: string | undefined | null
): { isValid: boolean; error?: string } {
  if (!signature) {
    return { isValid: false, error: "Missing x-wh-signature header" }
  }

  if (!payload) {
    return { isValid: false, error: "Empty payload" }
  }

  try {
    const verifier = crypto.createVerify("SHA256")
    verifier.update(payload)
    verifier.end()

    const isValid = verifier.verify(GHL_PUBLIC_KEY, signature, "base64")

    if (!isValid) {
      return { isValid: false, error: "Signature mismatch - payload may have been tampered with" }
    }

    return { isValid: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return { isValid: false, error: `Verification failed: ${message}` }
  }
}
