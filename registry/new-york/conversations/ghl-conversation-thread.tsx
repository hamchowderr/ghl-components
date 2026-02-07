"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { GHLMessageBubble } from "./ghl-message-bubble"
import { useGHLMessages } from "@/hooks/use-ghl-messages"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCcw, AlertCircle, MessageSquare, ChevronUp } from "lucide-react"
import type { GHLMessage } from "@/registry/new-york/server/types/conversation"

/**
 * Props for the GHLConversationThread component
 */
export interface GHLConversationThreadProps {
  /**
   * Conversation ID to fetch messages for
   * If provided, messages will be fetched automatically
   */
  conversationId?: string
  /**
   * Pre-loaded messages array (alternative to conversationId)
   * If provided, will be used instead of fetching
   */
  messages?: GHLMessage[]
  /**
   * Optional className for the container
   */
  className?: string
  /**
   * Height of the scroll area
   * @default "500px"
   */
  height?: string
  /**
   * Whether to auto-scroll to newest messages
   * @default true
   */
  autoScroll?: boolean
  /**
   * Interval to refetch messages in milliseconds
   * Set to 0 to disable auto-refetch
   * @default 5000
   */
  refetchInterval?: number
  /**
   * Whether to show channel icons on messages
   * @default true
   */
  showChannelIcons?: boolean
  /**
   * Whether to show message status indicators
   * @default true
   */
  showStatus?: boolean
  /**
   * Callback when load more is clicked
   */
  onLoadMore?: () => void
  /**
   * Whether there are more messages to load
   */
  hasMore?: boolean
  /**
   * Whether loading more messages
   */
  isLoadingMore?: boolean
}

/**
 * Message thread display component
 *
 * Displays a scrollable list of message bubbles with auto-scroll to newest.
 * Can either fetch messages automatically via conversationId or accept
 * pre-loaded messages array.
 *
 * @example
 * ```tsx
 * // With automatic fetching
 * <GHLConversationThread
 *   conversationId="conv123"
 *   refetchInterval={5000}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With pre-loaded messages
 * <GHLConversationThread
 *   messages={messages}
 *   autoScroll={true}
 * />
 * ```
 */
export function GHLConversationThread({
  conversationId,
  messages: providedMessages,
  className,
  height = "500px",
  autoScroll = true,
  refetchInterval = 5000,
  showChannelIcons = true,
  showStatus = true,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: GHLConversationThreadProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const [userScrolled, setUserScrolled] = React.useState(false)

  // Fetch messages if conversationId is provided
  const messagesResult = useGHLMessages(
    { conversationId: conversationId! },
    {
      enabled: !!conversationId && !providedMessages,
      refetchInterval: refetchInterval > 0 ? refetchInterval : undefined,
    }
  )

  const messages = providedMessages || messagesResult.messages
  const isLoading = !providedMessages && messagesResult.isLoading
  const error = !providedMessages && messagesResult.error

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (autoScroll && !userScrolled && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, autoScroll, userScrolled])

  // Detect user scroll to disable auto-scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const isAtBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 50
    setUserScrolled(!isAtBottom)
  }

  // Scroll to bottom button handler
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    setUserScrolled(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("relative", className)} style={{ height }}>
        <ScrollArea className="h-full p-4">
          <LoadingSkeleton />
        </ScrollArea>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={cn("relative", className)} style={{ height }}>
        <div className="flex items-center justify-center h-full p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load messages</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <span>{error.message || "An unexpected error occurred"}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => messagesResult.refetch()}
                className="w-fit"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Empty state
  if (!messages || messages.length === 0) {
    return (
      <div className={cn("relative", className)} style={{ height }}>
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-medium text-muted-foreground">No messages yet</h3>
          <p className="text-sm text-muted-foreground/75">
            Start the conversation by sending a message
          </p>
        </div>
      </div>
    )
  }

  // Sort messages by date (oldest first)
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
  )

  return (
    <div className={cn("relative", className)} style={{ height }}>
      <ScrollArea
        className="h-full"
        ref={scrollRef}
        onScroll={handleScroll as unknown as React.UIEventHandler<HTMLDivElement>}
      >
        <div className="p-4 space-y-4">
          {/* Load more button */}
          {hasMore && onLoadMore && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ChevronUp className="h-4 w-4 mr-2" />
                )}
                Load older messages
              </Button>
            </div>
          )}

          {/* Messages */}
          {sortedMessages.map((message) => (
            <GHLMessageBubble
              key={message.id}
              message={message}
              showChannelIcon={showChannelIcons}
              showStatus={showStatus}
            />
          ))}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      {userScrolled && (
        <Button
          variant="secondary"
          size="sm"
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 shadow-lg"
        >
          <ChevronUp className="h-4 w-4 mr-1 rotate-180" />
          New messages
        </Button>
      )}
    </div>
  )
}

/**
 * Loading skeleton for messages
 */
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Inbound message skeleton */}
      <div className="flex flex-col items-start gap-1 max-w-[80%]">
        <Skeleton className="h-16 w-48 rounded-2xl rounded-bl-md" />
        <Skeleton className="h-3 w-20" />
      </div>

      {/* Outbound message skeleton */}
      <div className="flex flex-col items-end gap-1 max-w-[80%] ml-auto">
        <Skeleton className="h-20 w-56 rounded-2xl rounded-br-md" />
        <Skeleton className="h-3 w-24" />
      </div>

      {/* Inbound message skeleton */}
      <div className="flex flex-col items-start gap-1 max-w-[80%]">
        <Skeleton className="h-12 w-40 rounded-2xl rounded-bl-md" />
        <Skeleton className="h-3 w-20" />
      </div>

      {/* Outbound message skeleton */}
      <div className="flex flex-col items-end gap-1 max-w-[80%] ml-auto">
        <Skeleton className="h-16 w-52 rounded-2xl rounded-br-md" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}
