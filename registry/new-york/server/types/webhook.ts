// GHL Webhook Types

export interface GHLWebhookPayload<T = unknown> {
  type: GHLWebhookEventType
  locationId: string
  timestamp: string
  webhookId: string
  data: T
}

export type GHLWebhookEventType =
  | "ContactCreate" | "ContactUpdate" | "ContactDelete" | "ContactDndUpdate" | "ContactTagUpdate"
  | "OpportunityCreate" | "OpportunityUpdate" | "OpportunityDelete" | "OpportunityStageUpdate"
  | "OpportunityStatusUpdate" | "OpportunityMonetaryValueUpdate" | "OpportunityAssignedToUpdate"
  | "AppointmentCreate" | "AppointmentUpdate" | "AppointmentDelete"
  | "TaskCreate" | "TaskComplete" | "TaskDelete"
  | "InvoiceCreate" | "InvoiceUpdate" | "InvoiceDelete" | "InvoiceSent" | "InvoiceViewed"
  | "InvoicePartiallyPaid" | "InvoicePaid" | "InvoiceVoid"
  | "ConversationUnreadUpdate" | "InboundMessage" | "OutboundMessage"
  | "LocationCreate" | "LocationUpdate"
  | "UserCreate" | "UserUpdate" | "UserDelete"

export interface GHLContactWebhookData {
  id: string
  locationId: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  tags?: string[]
  customFields?: Array<{ id: string; value: unknown }>
  dateAdded?: string
  dateUpdated?: string
}

export interface GHLOpportunityWebhookData {
  id: string
  locationId: string
  contactId: string
  pipelineId: string
  pipelineStageId: string
  name: string
  status: "open" | "won" | "lost" | "abandoned"
  monetaryValue?: number
  assignedTo?: string
  dateAdded?: string
  dateUpdated?: string
}

export interface GHLAppointmentWebhookData {
  id: string
  locationId: string
  contactId: string
  calendarId: string
  title: string
  startTime: string
  endTime: string
  status: "confirmed" | "cancelled" | "showed" | "noshow"
  dateAdded?: string
  dateUpdated?: string
}

export interface GHLMessageWebhookData {
  id: string
  locationId: string
  contactId: string
  conversationId: string
  type: "SMS" | "Email" | "FB" | "GMB" | "IG" | "WhatsApp" | "Live_Chat"
  direction: "inbound" | "outbound"
  body: string
  dateAdded: string
}

export type GHLWebhookHandler<T = unknown> = (data: T) => Promise<void> | void

export interface GHLWebhookHandlers {
  onContactCreate?: GHLWebhookHandler<GHLContactWebhookData>
  onContactUpdate?: GHLWebhookHandler<GHLContactWebhookData>
  onContactDelete?: GHLWebhookHandler<{ id: string }>
  onContactDndUpdate?: GHLWebhookHandler<GHLContactWebhookData>
  onContactTagUpdate?: GHLWebhookHandler<GHLContactWebhookData>
  onOpportunityCreate?: GHLWebhookHandler<GHLOpportunityWebhookData>
  onOpportunityUpdate?: GHLWebhookHandler<GHLOpportunityWebhookData>
  onOpportunityDelete?: GHLWebhookHandler<{ id: string }>
  onOpportunityStageUpdate?: GHLWebhookHandler<GHLOpportunityWebhookData>
  onOpportunityStatusUpdate?: GHLWebhookHandler<GHLOpportunityWebhookData>
  onOpportunityMonetaryValueUpdate?: GHLWebhookHandler<GHLOpportunityWebhookData>
  onAppointmentCreate?: GHLWebhookHandler<GHLAppointmentWebhookData>
  onAppointmentUpdate?: GHLWebhookHandler<GHLAppointmentWebhookData>
  onAppointmentDelete?: GHLWebhookHandler<{ id: string }>
  onInboundMessage?: GHLWebhookHandler<GHLMessageWebhookData>
  onOutboundMessage?: GHLWebhookHandler<GHLMessageWebhookData>
  onConversationUnreadUpdate?: GHLWebhookHandler<{ conversationId: string; unreadCount: number }>
  onUnknownEvent?: GHLWebhookHandler<unknown>
}

export interface GHLWebhookConfig {
  processedIds?: Set<string>
  verifySignature?: boolean
  onError?: (error: Error, payload: GHLWebhookPayload) => void
}
