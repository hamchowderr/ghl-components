"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { GHLChannelSelector } from "./ghl-channel-selector"
import { useGHLSendMessage } from "@/hooks/use-ghl-send-message"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/registry/new-york/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, Loader2, X } from "lucide-react"
import type { GHLMessageType, GHLMessage } from "@/registry/new-york/server/types/conversation"

/**
 * Props for the GHLMessageComposer component
 */
export interface GHLMessageComposerProps {
  /**
   * The contact ID to send messages to
   */
  contactId: string
  /**
   * Optional conversation ID (for context)
   */
  conversationId?: string
  /**
   * Default channel to use
   * @default "SMS"
   */
  defaultChannel?: GHLMessageType
  /**
   * Available channels to choose from
   */
  availableChannels?: GHLMessageType[]
  /**
   * Callback when message is sent successfully
   */
  onSend?: (message: GHLMessage) => void
  /**
   * Callback when send fails
   */
  onError?: (error: Error) => void
  /**
   * Optional className for the container
   */
  className?: string
  /**
   * Placeholder text for the message input
   */
  placeholder?: string
  /**
   * Whether to show the channel selector
   * @default true
   */
  showChannelSelector?: boolean
  /**
   * Whether the composer is disabled
   */
  disabled?: boolean
}

/**
 * Message composer component with send functionality
 *
 * Provides a textarea for composing messages, channel selection,
 * and uses the useSendMessage hook to send messages.
 *
 * @example
 * ```tsx
 * <GHLMessageComposer
 *   contactId="contact123"
 *   onSend={(message) => {
 *     console.log("Sent:", message)
 *     refetchMessages()
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With specific channel
 * <GHLMessageComposer
 *   contactId="contact123"
 *   defaultChannel="Email"
 *   availableChannels={["Email", "SMS"]}
 * />
 * ```
 */
export function GHLMessageComposer({
  contactId,
  conversationId,
  defaultChannel = "SMS",
  availableChannels,
  onSend,
  onError,
  className,
  placeholder = "Type a message...",
  showChannelSelector = true,
  disabled = false,
}: GHLMessageComposerProps) {
  const [message, setMessage] = React.useState("")
  const [channel, setChannel] = React.useState<GHLMessageType>(defaultChannel)
  const [emailSubject, setEmailSubject] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const { mutate, isLoading, error } = useGHLSendMessage({
    onSuccess: (data) => {
      setMessage("")
      setEmailSubject("")
      onSend?.(data)
      textareaRef.current?.focus()
    },
    onError: (err) => {
      onError?.(err)
    },
    invalidateQueries: conversationId ? [["messages", conversationId]] : undefined,
  })

  const isEmail = channel === "Email"
  const canSend = message.trim().length > 0 && (!isEmail || emailSubject.trim().length > 0)

  const handleSend = () => {
    if (!canSend || isLoading || disabled) return

    mutate({
      type: channel,
      contactId,
      message: message.trim(),
      ...(isEmail && { subject: emailSubject.trim() }),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send on Enter (but not Shift+Enter for new lines)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn("space-y-3 p-4 border-t bg-background", className)}>
      {/* Email subject line */}
      {isEmail && (
        <div className="space-y-1">
          <Label htmlFor="email-subject" className="text-xs">
            Subject
          </Label>
          <Input
            id="email-subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            placeholder="Email subject..."
            disabled={disabled || isLoading}
            className="h-8"
          />
        </div>
      )}

      {/* Message input row */}
      <div className="flex gap-2">
        {/* Channel selector */}
        {showChannelSelector && (
          <GHLChannelSelector
            value={channel}
            onChange={setChannel}
            availableChannels={availableChannels}
            disabled={disabled || isLoading}
            size="sm"
            className="w-[140px] flex-shrink-0"
          />
        )}

        {/* Message textarea */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className="min-h-[80px] resize-none pr-12"
            rows={3}
          />

          {/* Send button inside textarea */}
          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={!canSend || isLoading || disabled}
            className="absolute bottom-2 right-2 h-8 w-8"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <X className="h-4 w-4" />
          <span>{error.message}</span>
        </div>
      )}

      {/* Keyboard hint */}
      <p className="text-xs text-muted-foreground">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}
