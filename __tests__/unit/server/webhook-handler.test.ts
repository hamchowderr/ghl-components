import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock verify-signature
vi.mock("@/registry/new-york/server/verify-signature", () => ({
  verifyGHLSignature: vi.fn(() => true),
}))

vi.mock("@/registry/new-york/server/constants", () => ({
  GHL_SIGNATURE_HEADER: "x-wh-signature",
  GHL_PUBLIC_KEY: "mock-key",
}))

import { withGHLWebhook, parseGHLWebhook } from "@/registry/new-york/server/webhook-handler"
import { verifyGHLSignature } from "@/registry/new-york/server/verify-signature"

const mockVerify = vi.mocked(verifyGHLSignature)

function createMockRequest(body: object, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost:3000/api/webhooks/ghl", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-wh-signature": "valid-signature",
      ...headers,
    },
    body: JSON.stringify(body),
  })
}

describe("withGHLWebhook", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockVerify.mockReturnValue(true)
  })

  it("returns 200 for valid webhook", async () => {
    const handler = withGHLWebhook({})
    const body = {
      type: "ContactCreate",
      webhookId: "wh-123",
      data: { id: "contact-1", firstName: "John" },
    }

    const req = createMockRequest(body) as unknown as import("next/server").NextRequest
    const response = await handler(req)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
  })

  it("returns 401 when signature verification fails", async () => {
    mockVerify.mockReturnValue(false)

    const handler = withGHLWebhook({})
    const body = {
      type: "ContactCreate",
      webhookId: "wh-456",
      data: {},
    }

    const req = createMockRequest(body) as unknown as import("next/server").NextRequest
    const response = await handler(req)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.error).toBe("Invalid signature")
  })

  it("skips verification when configured", async () => {
    mockVerify.mockReturnValue(false)

    const handler = withGHLWebhook({}, { verifySignature: false })
    const body = {
      type: "ContactCreate",
      webhookId: "wh-789",
      data: {},
    }

    const req = createMockRequest(body) as unknown as import("next/server").NextRequest
    const response = await handler(req)

    expect(response.status).toBe(200)
    expect(mockVerify).not.toHaveBeenCalled()
  })

  it("deduplicates webhooks by webhookId", async () => {
    const onContactCreate = vi.fn()
    const seen = new Set<string>()
    const deduplicationCache = {
      has: (id: string) => seen.has(id),
      add: (id: string) => { seen.add(id) },
    }

    const handler = withGHLWebhook(
      { onContactCreate },
      { deduplicationCache }
    )

    const body = {
      type: "ContactCreate",
      webhookId: "wh-duplicate",
      data: { id: "contact-1" },
    }

    const req1 = createMockRequest(body) as unknown as import("next/server").NextRequest
    const req2 = createMockRequest(body) as unknown as import("next/server").NextRequest

    await handler(req1)
    const response2 = await handler(req2)
    const json2 = await response2.json()

    expect(json2.message).toBe("Already processed")
  })

  it("returns 400 for payloads missing required fields", async () => {
    const handler = withGHLWebhook({})
    const body = { foo: "bar" } // missing type, webhookId, data

    const req = createMockRequest(body) as unknown as import("next/server").NextRequest
    const response = await handler(req)

    expect(response.status).toBe(400)
  })

  it("calls the correct handler based on event type", async () => {
    const onContactCreate = vi.fn()
    const onContactUpdate = vi.fn()
    const seen = new Set<string>()
    const deduplicationCache = {
      has: (id: string) => seen.has(id),
      add: (id: string) => { seen.add(id) },
    }

    const handler = withGHLWebhook(
      { onContactCreate, onContactUpdate },
      { deduplicationCache }
    )

    const body = {
      type: "ContactUpdate",
      webhookId: "wh-update-1",
      data: { id: "contact-1", firstName: "Jane" },
    }

    const req = createMockRequest(body) as unknown as import("next/server").NextRequest
    await handler(req)

    // Give async processing a moment
    await new Promise((r) => setTimeout(r, 50))

    expect(onContactCreate).not.toHaveBeenCalled()
    expect(onContactUpdate).toHaveBeenCalledWith(body.data)
  })

  it("handles malformed JSON gracefully", async () => {
    const handler = withGHLWebhook({})

    const req = new Request("http://localhost:3000/api/webhooks/ghl", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-wh-signature": "valid-signature",
      },
      body: "not valid json{{{",
    }) as unknown as import("next/server").NextRequest

    const response = await handler(req)

    // Should return 200 (GHL expects 200 even on errors)
    expect(response.status).toBe(200)
  })
})

describe("parseGHLWebhook", () => {
  it("parses string body", () => {
    const body = JSON.stringify({
      type: "ContactCreate",
      webhookId: "wh-1",
      data: { id: "123" },
    })

    const result = parseGHLWebhook(body)

    expect(result.type).toBe("ContactCreate")
    expect(result.webhookId).toBe("wh-1")
    expect(result.data).toEqual({ id: "123" })
  })

  it("passes through object body", () => {
    const body = {
      type: "OpportunityCreate",
      webhookId: "wh-2",
      data: { id: "opp-1" },
    }

    const result = parseGHLWebhook(body)

    expect(result.type).toBe("OpportunityCreate")
    expect(result.data).toEqual({ id: "opp-1" })
  })
})
