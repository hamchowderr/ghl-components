"use client"

import * as React from "react"
import { format, isToday, isYesterday } from "date-fns"
import { cn } from "@/lib/utils"
import { GHLChannelIcon } from "./ghl-channel-icon"
import { useGHLConversations } from "@/hooks/use-ghl-conversations"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, RefreshCcw, AlertCircle, Inbox, Star } from "lucide-react"
import type { GHLConversation } from "@/registry/new-york/server/types/conversation"

/**
 * Status filter options
 */
type StatusFilter = "all" | "read" | "unread" | "starred"

/**
 * Props for the GHLConversationList component
 */
export interface GHLConversationListProps {
  /**
   * Location ID to fetch conversations for
   */
  locationId: string
  /**
   * Callback when a conversation is selected
   */
  onSelect?: (conversation: GHLConversation) => void
  /**
   * Currently selected conversation ID
   */
  selectedId?: string
  /**
   * Optional className for the container
   */
  className?: string
  /**
   * Height of the list
   * @default "600px"
   */
  height?: string
  /**
   * Whether to show the search input
   * @default true
   */
  showSearch?: boolean
  /**
   * Whether to show the status filter
   * @default true
   */
  showFilter?: boolean
  /**
   * Interval to refetch conversations in milliseconds
   * @default 10000
   */
  refetchInterval?: number
  /**
   * Maximum number of conversations to show per page
   * @default 25
   */
  limit?: number
}

/**
 * Format timestamp for conversation preview
 */
function formatConversationTime(dateString?: string): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  if (isToday(date)) {
    return format(date, "h:mm a")
  }
  if (isYesterday(date)) {
    return "Yesterday"
  }
  return format(date, "MMM d")
}

/**
 * Get initials from a name
 */
function getInitials(name?: string): string {
  if (!name) return "?"
  const parts = name.trim().split(" ")
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?"
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Truncate message preview
 */
function truncateMessage(message?: string, maxLength = 50): string {
  if (!message) return "No messages yet"
  if (message.length <= maxLength) return message
  return message.substring(0, maxLength).trim() + "..."
}

/**
 * Inbox view component for conversations
 *
 * Displays a list of conversations with search, filtering,
 * unread counts, and last message preview.
 *
 * @example
 * ```tsx
 * <GHLConversationList
 *   locationId="loc123"
 *   onSelect={(conv) => setSelectedConversation(conv)}
 *   selectedId={selectedConversation?.id}
 * />
 * ```
 */
export function GHLConversationList({
  locationId,
  onSelect,
  selectedId,
  className,
  height = "600px",
  showSearch = true,
  showFilter = true,
  refetchInterval = 10000,
  limit = 25,
}: GHLConversationListProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")

  // Fetch conversations
  const { conversations, isLoading, error, refetch } = useGHLConversations(
    {
      locationId,
      status: statusFilter,
      limit,
    },
    { refetchInterval }
  )

  // Filter conversations by search query (client-side)
  const filteredConversations = React.useMemo(() => {
    if (!searchQuery.trim()) return conversations
    const query = searchQuery.toLowerCase()
    return conversations.filter(
      (conv) =>
        conv.contactName?.toLowerCase().includes(query) ||
        conv.contactEmail?.toLowerCase().includes(query) ||
        conv.contactPhone?.includes(query) ||
        conv.lastMessageBody?.toLowerCase().includes(query)
    )
  }, [conversations, searchQuery])

  // Handle conversation selection
  const handleSelect = (conversation: GHLConversation) => {
    onSelect?.(conversation)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, conversation: GHLConversation) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleSelect(conversation)
    }
  }

  return (
    <div className={cn("flex flex-col border rounded-lg", className)} style={{ height }}>
      {/* Header with search and filter */}
      <div className="p-3 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Conversations</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>

        <div className="flex gap-2">
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="h-8 pl-8"
              />
            </div>
          )}

          {showFilter && (
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className="h-8 w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="starred">Starred</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : filteredConversations.length === 0 ? (
          <EmptyState searchQuery={searchQuery} statusFilter={statusFilter} />
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedId === conversation.id}
                onClick={() => handleSelect(conversation)}
                onKeyDown={(e) => handleKeyDown(e, conversation)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

/**
 * Individual conversation item
 */
function ConversationItem({
  conversation,
  isSelected,
  onClick,
  onKeyDown,
}: {
  conversation: GHLConversation
  isSelected: boolean
  onClick: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}) {
  const initials = getInitials(conversation.contactName)
  const hasUnread = conversation.unreadCount > 0

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-selected={isSelected}
      className={cn(
        "flex items-start gap-3 p-3 cursor-pointer transition-colors",
        "hover:bg-muted/50 focus:outline-none focus:bg-muted/50",
        isSelected && "bg-muted",
        hasUnread && "bg-primary/5"
      )}
    >
      {/* Avatar */}
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarFallback className={hasUnread ? "font-semibold" : ""}>
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate text-sm",
              hasUnread ? "font-semibold" : "font-medium"
            )}
          >
            {conversation.contactName || "Unknown Contact"}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatConversationTime(conversation.lastMessageDate)}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          {/* Channel icon */}
          {conversation.lastMessageType && (
            <GHLChannelIcon
              channel={conversation.lastMessageType}
              size={12}
              className="flex-shrink-0 opacity-60"
            />
          )}

          {/* Direction indicator */}
          {conversation.lastMessageDirection === "outbound" && (
            <span className="text-xs text-muted-foreground">You:</span>
          )}

          {/* Message preview */}
          <span
            className={cn(
              "text-sm truncate",
              hasUnread ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {truncateMessage(conversation.lastMessageBody)}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {hasUnread && (
          <Badge variant="default" className="rounded-full h-5 min-w-5 px-1.5">
            {conversation.unreadCount}
          </Badge>
        )}
        {conversation.starred && (
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        )}
      </div>
    </div>
  )
}

/**
 * Loading skeleton
 */
function LoadingSkeleton() {
  return (
    <div className="divide-y">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Error state
 */
function ErrorState({
  error,
  onRetry,
}: {
  error: Error
  onRetry: () => void
}) {
  return (
    <div className="flex items-center justify-center p-6">
      <Alert variant="destructive" className="max-w-sm">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to load conversations</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <span>{error.message || "An unexpected error occurred"}</span>
          <Button variant="outline" size="sm" onClick={onRetry} className="w-fit">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}

/**
 * Empty state
 */
function EmptyState({
  searchQuery,
  statusFilter,
}: {
  searchQuery: string
  statusFilter: StatusFilter
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="font-medium text-muted-foreground">No conversations found</h3>
      <p className="text-sm text-muted-foreground/75 mt-1">
        {searchQuery
          ? `No conversations match "${searchQuery}"`
          : statusFilter !== "all"
            ? `No ${statusFilter} conversations`
            : "Start a conversation to see it here"}
      </p>
    </div>
  )
}
