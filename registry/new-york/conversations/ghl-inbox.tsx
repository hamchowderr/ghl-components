"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { GHLConversationList } from "./ghl-conversation-list"
import { GHLConversationHeader } from "./ghl-conversation-header"
import { GHLConversationThread } from "./ghl-conversation-thread"
import { GHLMessageComposer } from "./ghl-message-composer"
import { MessageSquare } from "lucide-react"
import type { GHLConversation } from "@/registry/new-york/server/types/conversation"

/**
 * Props for the GHLInbox component
 */
export interface GHLInboxProps {
  /**
   * Location ID to fetch conversations for
   */
  locationId: string
  /**
   * Default conversation to select on mount
   */
  defaultConversationId?: string
  /**
   * Height of the inbox container
   * @default "700px"
   */
  height?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Full inbox experience with conversation list, message thread, and composer
 *
 * Split-panel layout: conversation list on the left (40%) and
 * thread/composer on the right (60%).
 *
 * @example
 * ```tsx
 * <GHLInbox
 *   locationId="loc_123"
 *   height="700px"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With a default conversation pre-selected
 * <GHLInbox
 *   locationId="loc_123"
 *   defaultConversationId="conv_456"
 * />
 * ```
 */
export function GHLInbox({
  locationId,
  defaultConversationId,
  height = "700px",
  className,
}: GHLInboxProps) {
  const [selectedConversation, setSelectedConversation] =
    React.useState<GHLConversation | null>(null)

  // Handle conversation selection from the list
  const handleSelect = React.useCallback((conversation: GHLConversation) => {
    setSelectedConversation(conversation)
  }, [])

  return (
    <div
      className={cn("flex border rounded-lg overflow-hidden bg-background", className)}
      style={{ height }}
    >
      {/* Left panel: Conversation List */}
      <div className="w-[40%] border-r flex flex-col min-w-0">
        <GHLConversationList
          locationId={locationId}
          onSelect={handleSelect}
          selectedId={
            selectedConversation?.id || defaultConversationId
          }
          height="100%"
          className="border-0 rounded-none"
        />
      </div>

      {/* Right panel: Thread + Composer */}
      <div className="w-[60%] flex flex-col min-w-0">
        {selectedConversation ? (
          <>
            {/* Conversation header */}
            <GHLConversationHeader
              conversation={selectedConversation}
            />

            {/* Message thread */}
            <div className="flex-1 min-h-0">
              <GHLConversationThread
                conversationId={selectedConversation.id}
                height="100%"
              />
            </div>

            {/* Message composer */}
            <GHLMessageComposer
              contactId={selectedConversation.contactId}
              conversationId={selectedConversation.id}
            />
          </>
        ) : (
          <InboxEmptyState />
        )}
      </div>
    </div>
  )
}

/**
 * Empty state when no conversation is selected
 */
function InboxEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-medium text-muted-foreground">
        Select a conversation
      </h3>
      <p className="text-sm text-muted-foreground/75 mt-1 max-w-xs">
        Choose a conversation from the list to view messages and send replies.
      </p>
    </div>
  )
}
