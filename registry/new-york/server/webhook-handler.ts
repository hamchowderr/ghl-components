import { NextRequest, NextResponse } from "next/server"
import { verifyGHLSignature } from "./verify-signature"
import { GHL_SIGNATURE_HEADER } from "./constants"
import type {
  GHLWebhookPayload,
  GHLWebhookHandlers,
  GHLWebhookConfig,
  GHLContactWebhookData,
  GHLOpportunityWebhookData,
  GHLAppointmentWebhookData,
  GHLMessageWebhookData,
} from "./types/webhook"

const processedWebhooks = new Set<string>()

/**
 * Create a Next.js API route handler for GHL webhooks
 * 
 * @example
 * ```ts
 * // app/api/webhooks/ghl/route.ts
 * import { withGHLWebhook } from "@/lib/ghl/webhook-handler"
 *
 * export const POST = withGHLWebhook({
 *   onContactCreate: async (data) => {
 *     await db.contacts.create(data)
 *   },
 *   onAppointmentCreate: async (data) => {
 *     await sendSlackNotification(`New booking: ${data.title}`)
 *   }
 * })
 * ```
 */
export function withGHLWebhook(
  handlers: GHLWebhookHandlers,
  config: GHLWebhookConfig = {}
) {
  const {
    processedIds = processedWebhooks,
    verifySignature: shouldVerify = true,
    onError,
  } = config

  return async function handler(req: NextRequest) {
    try {
      const rawBody = await req.text()
      const signature = req.headers.get(GHL_SIGNATURE_HEADER)

      if (shouldVerify && !verifyGHLSignature(rawBody, signature)) {
        console.error("[GHL Webhook] Invalid signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }

      const payload: GHLWebhookPayload = JSON.parse(rawBody)

      if (processedIds.has(payload.webhookId)) {
        console.log(`[GHL Webhook] Duplicate, skipping: ${payload.webhookId}`)
        return NextResponse.json({ message: "Already processed" })
      }

      console.log(`[GHL Webhook] Processing: ${payload.type} (${payload.webhookId})`)
      processedIds.add(payload.webhookId)

      processWebhookAsync(payload, handlers, onError)

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("[GHL Webhook] Error:", error)
      return NextResponse.json({ success: false, error: "Processing failed" }, { status: 200 })
    }
  }
}

async function processWebhookAsync(
  payload: GHLWebhookPayload,
  handlers: GHLWebhookHandlers,
  onError?: (error: Error, payload: GHLWebhookPayload) => void
) {
  try {
    await routeWebhook(payload, handlers)
    console.log(`[GHL Webhook] Successfully processed: ${payload.webhookId}`)
  } catch (error) {
    console.error(`[GHL Webhook] Failed: ${payload.webhookId}`, error)
    if (onError && error instanceof Error) {
      onError(error, payload)
    }
  }
}

async function routeWebhook(payload: GHLWebhookPayload, handlers: GHLWebhookHandlers) {
  const { type, data } = payload

  switch (type) {
    case "ContactCreate":
      await handlers.onContactCreate?.(data as GHLContactWebhookData)
      break
    case "ContactUpdate":
      await handlers.onContactUpdate?.(data as GHLContactWebhookData)
      break
    case "ContactDelete":
      await handlers.onContactDelete?.(data as { id: string })
      break
    case "ContactDndUpdate":
      await handlers.onContactDndUpdate?.(data as GHLContactWebhookData)
      break
    case "ContactTagUpdate":
      await handlers.onContactTagUpdate?.(data as GHLContactWebhookData)
      break
    case "OpportunityCreate":
      await handlers.onOpportunityCreate?.(data as GHLOpportunityWebhookData)
      break
    case "OpportunityUpdate":
      await handlers.onOpportunityUpdate?.(data as GHLOpportunityWebhookData)
      break
    case "OpportunityDelete":
      await handlers.onOpportunityDelete?.(data as { id: string })
      break
    case "OpportunityStageUpdate":
      await handlers.onOpportunityStageUpdate?.(data as GHLOpportunityWebhookData)
      break
    case "OpportunityStatusUpdate":
      await handlers.onOpportunityStatusUpdate?.(data as GHLOpportunityWebhookData)
      break
    case "OpportunityMonetaryValueUpdate":
      await handlers.onOpportunityMonetaryValueUpdate?.(data as GHLOpportunityWebhookData)
      break
    case "AppointmentCreate":
      await handlers.onAppointmentCreate?.(data as GHLAppointmentWebhookData)
      break
    case "AppointmentUpdate":
      await handlers.onAppointmentUpdate?.(data as GHLAppointmentWebhookData)
      break
    case "AppointmentDelete":
      await handlers.onAppointmentDelete?.(data as { id: string })
      break
    case "InboundMessage":
      await handlers.onInboundMessage?.(data as GHLMessageWebhookData)
      break
    case "OutboundMessage":
      await handlers.onOutboundMessage?.(data as GHLMessageWebhookData)
      break
    case "ConversationUnreadUpdate":
      await handlers.onConversationUnreadUpdate?.(data as { conversationId: string; unreadCount: number })
      break
    default:
      console.warn(`[GHL Webhook] Unknown event type: ${type}`)
      await handlers.onUnknownEvent?.(data)
  }
}

export function parseGHLWebhook<T = unknown>(body: string | object): GHLWebhookPayload<T> {
  const payload = typeof body === "string" ? JSON.parse(body) : body
  return payload as GHLWebhookPayload<T>
}
