// GHL Conversation & Message Types

export interface GHLConversation {
  id: string
  locationId: string
  contactId: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  lastMessageBody?: string
  lastMessageDate?: string
  lastMessageDirection?: "inbound" | "outbound"
  lastMessageType?: GHLMessageType
  unreadCount: number
  inbox: boolean
  starred: boolean
  assignedTo?: string
  dateAdded: string
  dateUpdated: string
}

export interface GHLMessage {
  id: string
  locationId: string
  conversationId: string
  contactId: string
  type: GHLMessageType
  direction: "inbound" | "outbound"
  status: GHLMessageStatus
  body: string
  contentType: "text/plain" | "text/html"
  attachments?: GHLMessageAttachment[]
  meta?: GHLMessageMeta
  source?: string
  userId?: string
  dateAdded: string
}

export type GHLMessageType = "SMS" | "Email" | "FB" | "GMB" | "IG" | "WhatsApp" | "Live_Chat" | "Call" | "Custom"

export type GHLMessageStatus =
  | "pending" | "scheduled" | "sent" | "delivered" | "read"
  | "undelivered" | "failed" | "opened" | "clicked" | "bounced" | "spam"

export interface GHLMessageAttachment {
  type: string
  url: string
  name?: string
  size?: number
}

export interface GHLMessageMeta {
  email?: {
    subject?: string
    from?: string
    to?: string[]
    cc?: string[]
    bcc?: string[]
    replyTo?: string
    messageId?: string
  }
  sms?: { from?: string; to?: string }
  call?: { duration?: number; recordingUrl?: string; status?: string }
}

export interface GHLGetConversationsRequest {
  locationId: string
  contactId?: string
  assignedTo?: string
  status?: "all" | "read" | "unread" | "starred"
  limit?: number
  startAfter?: number
  startAfterId?: string
}

export interface GHLGetMessagesRequest {
  conversationId: string
  limit?: number
  startAfter?: number
  startAfterId?: string
}

export interface GHLSendMessageRequest {
  type: GHLMessageType
  contactId: string
  message: string
  subject?: string
  emailFrom?: string
  emailTo?: string
  emailCc?: string
  emailBcc?: string
  emailReplyTo?: string
  fromNumber?: string
  toNumber?: string
  attachments?: string[]
  scheduledTimestamp?: string
  templateId?: string
}

export interface GHLSendEmailRequest {
  locationId: string
  contactId: string
  subject: string
  body: string
  from: string
  to: string
  cc?: string
  bcc?: string
  replyTo?: string
  attachments?: string[]
}

export interface GHLSendSMSRequest {
  locationId: string
  contactId: string
  body: string
  fromNumber?: string
  scheduledTimestamp?: string
}

export interface GHLUpdateConversationRequest {
  conversationId: string
  starred?: boolean
  unreadCount?: number
  assignedTo?: string
}
