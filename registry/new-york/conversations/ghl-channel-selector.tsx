"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { GHLChannelIcon, getChannelLabel } from "./ghl-channel-icon"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { GHLMessageType } from "@/registry/new-york/server/types/conversation"

/**
 * Default available channels if none specified
 */
const DEFAULT_CHANNELS: GHLMessageType[] = [
  "SMS",
  "Email",
  "WhatsApp",
  "FB",
  "IG",
  "GMB",
  "Live_Chat",
]

/**
 * Props for the GHLChannelSelector component
 */
export interface GHLChannelSelectorProps {
  /**
   * Currently selected channel
   */
  value: GHLMessageType
  /**
   * Callback when channel is changed
   */
  onChange: (channel: GHLMessageType) => void
  /**
   * List of available channels to show
   * @default ["SMS", "Email", "WhatsApp", "FB", "IG", "GMB", "Live_Chat"]
   */
  availableChannels?: GHLMessageType[]
  /**
   * Disabled channels that cannot be selected
   */
  disabledChannels?: GHLMessageType[]
  /**
   * Whether the selector is disabled
   */
  disabled?: boolean
  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string
  /**
   * Optional className for the trigger
   */
  className?: string
  /**
   * Size variant
   * @default "default"
   */
  size?: "default" | "sm"
}

/**
 * Dropdown selector for messaging channels
 *
 * Allows users to select which channel (SMS, Email, WhatsApp, etc.)
 * to use for sending messages.
 *
 * @example
 * ```tsx
 * const [channel, setChannel] = useState<GHLMessageType>("SMS")
 *
 * <GHLChannelSelector
 *   value={channel}
 *   onChange={setChannel}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With limited available channels
 * <GHLChannelSelector
 *   value={channel}
 *   onChange={setChannel}
 *   availableChannels={["SMS", "Email"]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With disabled channels
 * <GHLChannelSelector
 *   value={channel}
 *   onChange={setChannel}
 *   disabledChannels={["WhatsApp"]}
 * />
 * ```
 */
export function GHLChannelSelector({
  value,
  onChange,
  availableChannels = DEFAULT_CHANNELS,
  disabledChannels = [],
  disabled = false,
  placeholder = "Select channel",
  className,
  size = "default",
}: GHLChannelSelectorProps) {
  const handleValueChange = (newValue: string) => {
    onChange(newValue as GHLMessageType)
  }

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          size === "sm" && "h-8 text-sm",
          className
        )}
      >
        <SelectValue placeholder={placeholder}>
          {value && (
            <div className="flex items-center gap-2">
              <GHLChannelIcon channel={value} size={size === "sm" ? 14 : 16} />
              <span>{getChannelLabel(value)}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableChannels.map((channel) => {
          const isDisabled = disabledChannels.includes(channel)
          return (
            <SelectItem
              key={channel}
              value={channel}
              disabled={isDisabled}
            >
              <div className="flex items-center gap-2">
                <GHLChannelIcon channel={channel} size={16} />
                <span>{getChannelLabel(channel)}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
