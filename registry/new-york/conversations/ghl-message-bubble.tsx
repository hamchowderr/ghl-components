"use client"

import * as React from "react"
import { format, isToday, isYesterday } from "date-fns"
import { cn } from "@/lib/utils"
import { GHLChannelIcon } from "./ghl-channel-icon"
import { Paperclip, Check, CheckCheck, AlertCircle, Clock } from "lucide-react"
import type { GHLMessage, GHLMessageStatus } from "@/registry/new-york/server/types/conversation"

/**
 * Props for the GHLMessageBubble component
 */
export interface GHLMessageBubbleProps {
  /**
   * The message to display
   */
  message: GHLMessage
  /**
   * Optional className for the container
   */
  className?: string
  /**
   * Whether to show the channel icon
   * @default true
   */
  showChannelIcon?: boolean
  /**
   * Whether to show the message status
   * @default true
   */
  showStatus?: boolean
}

/**
 * Format the message timestamp
 */
function formatMessageTime(dateString: string): string {
  const date = new Date(dateString)
  if (isToday(date)) {
    return format(date, "h:mm a")
  }
  if (isYesterday(date)) {
    return `Yesterday ${format(date, "h:mm a")}`
  }
  return format(date, "MMM d, h:mm a")
}

/**
 * Get status icon and color based on message status
 */
function getStatusIndicator(status: GHLMessageStatus): {
  icon: React.ReactNode
  color: string
} {
  switch (status) {
    case "pending":
    case "scheduled":
      return { icon: <Clock className="h-3 w-3" />, color: "text-muted-foreground" }
    case "sent":
      return { icon: <Check className="h-3 w-3" />, color: "text-muted-foreground" }
    case "delivered":
    case "read":
    case "opened":
    case "clicked":
      return { icon: <CheckCheck className="h-3 w-3" />, color: "text-blue-500" }
    case "failed":
    case "undelivered":
    case "bounced":
    case "spam":
      return { icon: <AlertCircle className="h-3 w-3" />, color: "text-destructive" }
    default:
      return { icon: null, color: "" }
  }
}

/**
 * Single message display component
 *
 * Displays a message bubble with appropriate styling based on direction:
 * - Inbound messages align left with a lighter background
 * - Outbound messages align right with a primary background
 *
 * Shows timestamp, channel icon, message status, and attachments.
 *
 * @example
 * ```tsx
 * <GHLMessageBubble message={message} />
 *
 * // Hide channel icon
 * <GHLMessageBubble message={message} showChannelIcon={false} />
 *
 * // Hide status indicator
 * <GHLMessageBubble message={message} showStatus={false} />
 * ```
 */
export function GHLMessageBubble({
  message,
  className,
  showChannelIcon = true,
  showStatus = true,
}: GHLMessageBubbleProps) {
  const isOutbound = message.direction === "outbound"
  const statusIndicator = getStatusIndicator(message.status)

  // Render email subject if present
  const emailSubject = message.meta?.email?.subject

  return (
    <div
      className={cn(
        "flex flex-col max-w-[80%] gap-1",
        isOutbound ? "ml-auto items-end" : "mr-auto items-start",
        className
      )}
    >
      {/* Email subject line */}
      {emailSubject && (
        <p className="text-xs font-medium text-muted-foreground px-1">
          Re: {emailSubject}
        </p>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          "rounded-2xl px-4 py-2 max-w-full break-words",
          isOutbound
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted rounded-bl-md"
        )}
      >
        {/* Message body */}
        {message.contentType === "text/html" ? (
          <div
            className="text-sm prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: message.body }}
          />
        ) : (
          <p className="text-sm whitespace-pre-wrap">{message.body}</p>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-2 text-xs underline",
                  isOutbound
                    ? "text-primary-foreground/80 hover:text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Paperclip className="h-3 w-3" />
                {attachment.name || "Attachment"}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Metadata row: timestamp, channel, status */}
      <div
        className={cn(
          "flex items-center gap-2 px-1",
          isOutbound ? "flex-row-reverse" : "flex-row"
        )}
      >
        <span className="text-xs text-muted-foreground">
          {formatMessageTime(message.dateAdded)}
        </span>

        {showChannelIcon && (
          <GHLChannelIcon channel={message.type} size={12} className="opacity-60" />
        )}

        {showStatus && isOutbound && statusIndicator.icon && (
          <span className={statusIndicator.color}>{statusIndicator.icon}</span>
        )}
      </div>
    </div>
  )
}
