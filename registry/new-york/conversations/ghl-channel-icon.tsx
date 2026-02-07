"use client"

import * as React from "react"
import {
  MessageSquare,
  Mail,
  Facebook,
  Instagram,
  Phone,
  MessageCircle,
  Globe,
  MessagesSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { GHLMessageType } from "@/registry/new-york/server/types/conversation"

/**
 * Props for the GHLChannelIcon component
 */
export interface GHLChannelIconProps {
  /**
   * The message channel type
   */
  channel: GHLMessageType
  /**
   * Size of the icon in pixels
   * @default 16
   */
  size?: number
  /**
   * Optional className for styling
   */
  className?: string
}

/**
 * Channel configuration with icon and color
 */
const channelConfig: Record<
  GHLMessageType,
  {
    icon: React.ComponentType<{ className?: string; size?: number }>
    color: string
    label: string
  }
> = {
  SMS: {
    icon: MessageSquare,
    color: "text-green-600",
    label: "SMS",
  },
  Email: {
    icon: Mail,
    color: "text-blue-600",
    label: "Email",
  },
  FB: {
    icon: Facebook,
    color: "text-blue-500",
    label: "Facebook Messenger",
  },
  IG: {
    icon: Instagram,
    color: "text-pink-600",
    label: "Instagram",
  },
  WhatsApp: {
    icon: MessageCircle,
    color: "text-green-500",
    label: "WhatsApp",
  },
  GMB: {
    icon: Globe,
    color: "text-orange-500",
    label: "Google Business Messages",
  },
  Live_Chat: {
    icon: MessagesSquare,
    color: "text-purple-600",
    label: "Live Chat",
  },
  Call: {
    icon: Phone,
    color: "text-gray-600",
    label: "Phone Call",
  },
  Custom: {
    icon: MessageSquare,
    color: "text-gray-500",
    label: "Custom",
  },
}

/**
 * Icon indicator for message channels (SMS, Email, Facebook, Instagram, etc.)
 *
 * Displays the appropriate icon for each communication channel with
 * channel-specific colors for quick visual identification.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <GHLChannelIcon channel="SMS" />
 *
 * // With custom size
 * <GHLChannelIcon channel="Email" size={24} />
 *
 * // With custom styling
 * <GHLChannelIcon channel="WhatsApp" className="opacity-50" />
 * ```
 */
export function GHLChannelIcon({
  channel,
  size = 16,
  className,
}: GHLChannelIconProps) {
  const config = channelConfig[channel] || channelConfig.Custom
  const IconComponent = config.icon

  return (
    <IconComponent
      size={size}
      className={cn(config.color, className)}
      aria-label={config.label}
    />
  )
}

/**
 * Get the display label for a channel type
 */
export function getChannelLabel(channel: GHLMessageType): string {
  return channelConfig[channel]?.label || "Unknown"
}

/**
 * Get all available channels
 */
export function getAvailableChannels(): GHLMessageType[] {
  return Object.keys(channelConfig) as GHLMessageType[]
}
