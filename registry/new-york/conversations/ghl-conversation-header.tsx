"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { GHLChannelIcon, getChannelLabel } from "./ghl-channel-icon"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Star, StarOff, User, Phone, Mail } from "lucide-react"
import type { GHLConversation } from "@/registry/new-york/server/types/conversation"

/**
 * Props for the GHLConversationHeader component
 */
export interface GHLConversationHeaderProps {
  /**
   * The conversation to display
   */
  conversation: GHLConversation
  /**
   * Optional className for the container
   */
  className?: string
  /**
   * Callback when star/unstar is clicked
   */
  onToggleStar?: (conversationId: string, starred: boolean) => void
  /**
   * Callback when view contact is clicked
   */
  onViewContact?: (contactId: string) => void
  /**
   * Callback when call contact is clicked
   */
  onCallContact?: (contactId: string) => void
  /**
   * Callback when email contact is clicked
   */
  onEmailContact?: (contactId: string) => void
  /**
   * Whether actions are loading
   */
  isLoading?: boolean
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
 * Header component for conversation view
 *
 * Displays contact information including name, avatar, current channel,
 * and provides quick actions like starring, viewing contact, calling, etc.
 *
 * @example
 * ```tsx
 * <GHLConversationHeader
 *   conversation={conversation}
 *   onToggleStar={(id, starred) => updateConversation(id, { starred })}
 *   onViewContact={(id) => router.push(`/contacts/${id}`)}
 * />
 * ```
 */
export function GHLConversationHeader({
  conversation,
  className,
  onToggleStar,
  onViewContact,
  onCallContact,
  onEmailContact,
  isLoading = false,
}: GHLConversationHeaderProps) {
  const initials = getInitials(conversation.contactName)
  const channelLabel = conversation.lastMessageType
    ? getChannelLabel(conversation.lastMessageType)
    : "Unknown"

  const handleToggleStar = () => {
    onToggleStar?.(conversation.id, !conversation.starred)
  }

  const handleViewContact = () => {
    onViewContact?.(conversation.contactId)
  }

  const handleCallContact = () => {
    onCallContact?.(conversation.contactId)
  }

  const handleEmailContact = () => {
    onEmailContact?.(conversation.contactId)
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-4 border-b bg-background",
        className
      )}
    >
      {/* Contact Info */}
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold truncate">
              {conversation.contactName || "Unknown Contact"}
            </h2>
            {conversation.starred && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {conversation.lastMessageType && (
              <div className="flex items-center gap-1">
                <GHLChannelIcon
                  channel={conversation.lastMessageType}
                  size={14}
                />
                <span>{channelLabel}</span>
              </div>
            )}

            {conversation.contactPhone && (
              <>
                <span className="text-muted-foreground/50">|</span>
                <span className="truncate">{conversation.contactPhone}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Unread badge */}
        {conversation.unreadCount > 0 && (
          <Badge variant="default" className="rounded-full">
            {conversation.unreadCount}
          </Badge>
        )}

        {/* Star button */}
        {onToggleStar && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleToggleStar}
            disabled={isLoading}
            aria-label={conversation.starred ? "Unstar conversation" : "Star conversation"}
          >
            {conversation.starred ? (
              <StarOff className="h-4 w-4" />
            ) : (
              <Star className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* More actions dropdown */}
        {(onViewContact || onCallContact || onEmailContact) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading}
                aria-label="More actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewContact && (
                <DropdownMenuItem onClick={handleViewContact}>
                  <User className="h-4 w-4 mr-2" />
                  View Contact
                </DropdownMenuItem>
              )}
              {onCallContact && conversation.contactPhone && (
                <DropdownMenuItem onClick={handleCallContact}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call {conversation.contactPhone}
                </DropdownMenuItem>
              )}
              {onEmailContact && conversation.contactEmail && (
                <DropdownMenuItem onClick={handleEmailContact}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email {conversation.contactEmail}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
