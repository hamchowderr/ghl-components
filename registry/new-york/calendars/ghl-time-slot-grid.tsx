"use client"

import * as React from "react"
import { format, parseISO, isBefore } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import { Badge } from "@/components/ui/badge"

/**
 * Represents a time slot with start and end times
 */
export interface TimeSlot {
  startTime: string
  endTime: string
}

/**
 * Props for the GHLTimeSlotGrid component
 */
export interface GHLTimeSlotGridProps {
  /**
   * Array of available time slots
   */
  slots: TimeSlot[]
  /**
   * Callback when a slot is selected
   */
  onSelect: (slot: TimeSlot) => void
  /**
   * Currently selected slot
   */
  selectedSlot?: TimeSlot
  /**
   * Date for the slots (used for grouping and past slot detection)
   */
  date: Date
  /**
   * Optional className for the container
   */
  className?: string
}

/**
 * Groups time slots by time of day
 */
function groupSlotsByTimeOfDay(slots: TimeSlot[]) {
  const morning: TimeSlot[] = []
  const afternoon: TimeSlot[] = []
  const evening: TimeSlot[] = []

  slots.forEach((slot) => {
    const hour = new Date(slot.startTime).getHours()
    if (hour < 12) {
      morning.push(slot)
    } else if (hour < 17) {
      afternoon.push(slot)
    } else {
      evening.push(slot)
    }
  })

  return { morning, afternoon, evening }
}

/**
 * Visual time slot grid component
 * Displays available time slots in a responsive grid with grouping by time of day
 */
export function GHLTimeSlotGrid({
  slots,
  onSelect,
  selectedSlot,
  date: _date,
  className,
}: GHLTimeSlotGridProps) {
  const now = new Date()
  const { morning, afternoon, evening } = groupSlotsByTimeOfDay(slots)

  const isSlotSelected = (slot: TimeSlot) => {
    return (
      selectedSlot?.startTime === slot.startTime &&
      selectedSlot?.endTime === slot.endTime
    )
  }

  const isSlotPast = (slot: TimeSlot) => {
    return isBefore(new Date(slot.startTime), now)
  }

  const renderSlotButton = (slot: TimeSlot) => {
    const selected = isSlotSelected(slot)
    const isPast = isSlotPast(slot)

    return (
      <Button
        key={slot.startTime}
        variant={selected ? "default" : "outline"}
        className={cn(
          "h-auto py-3 px-4 flex flex-col items-center justify-center",
          selected && "ring-2 ring-primary ring-offset-2",
          isPast && "opacity-50"
        )}
        onClick={() => onSelect(slot)}
        disabled={isPast}
      >
        <span className="font-semibold">
          {format(parseISO(slot.startTime), "h:mm a")}
        </span>
        <span className="text-xs text-muted-foreground">
          {format(parseISO(slot.endTime), "h:mm a")}
        </span>
      </Button>
    )
  }

  const renderTimeGroup = (
    label: string,
    groupSlots: TimeSlot[],
    badgeVariant: "default" | "secondary" | "outline"
  ) => {
    if (groupSlots.length === 0) return null

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariant}>{label}</Badge>
          <span className="text-sm text-muted-foreground">
            {groupSlots.length} {groupSlots.length === 1 ? "slot" : "slots"}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {groupSlots.map(renderSlotButton)}
        </div>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center py-8 text-center",
          className
        )}
      >
        <div className="space-y-2">
          <p className="text-muted-foreground">No available slots</p>
          <p className="text-sm text-muted-foreground">
            Please select a different date
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {renderTimeGroup("Morning", morning, "default")}
      {renderTimeGroup("Afternoon", afternoon, "secondary")}
      {renderTimeGroup("Evening", evening, "outline")}
    </div>
  )
}
