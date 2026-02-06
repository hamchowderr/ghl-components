"use client"

import * as React from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useGHLAvailability } from "@/hooks/use-ghl-availability"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/registry/new-york/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { GHLTimeSlotGrid, type TimeSlot } from "./ghl-time-slot-grid"
import { CalendarIcon, Clock, RefreshCcw } from "lucide-react"

/**
 * Props for the GHLAvailabilityPicker component
 */
export interface GHLAvailabilityPickerProps {
  /**
   * The calendar ID to fetch availability for
   */
  calendarId: string
  /**
   * Currently selected date
   */
  selectedDate?: Date
  /**
   * Callback when a date is selected
   */
  onSelectDate?: (date: Date) => void
  /**
   * Callback when a time slot is selected
   */
  onSelectSlot: (slot: TimeSlot) => void
  /**
   * Currently selected time slot
   */
  selectedSlot?: TimeSlot
  /**
   * Optional timezone for the slots
   */
  timezone?: string
  /**
   * Optional className for the container
   */
  className?: string
  /**
   * Show calendar inline (default: true)
   */
  showCalendar?: boolean
  /**
   * Minimum date that can be selected (default: today)
   */
  minDate?: Date
}

/**
 * Availability picker component with calendar and time slot selection
 * Combines date selection with available time slots from GoHighLevel
 */
export function GHLAvailabilityPicker({
  calendarId,
  selectedDate = new Date(),
  onSelectDate,
  onSelectSlot,
  selectedSlot,
  timezone,
  className,
  showCalendar = true,
  minDate = new Date(),
}: GHLAvailabilityPickerProps) {
  const [date, setDate] = React.useState<Date>(selectedDate)

  // Format date for API (YYYY-MM-DD)
  const formattedDate = format(date, "yyyy-MM-dd")

  // Fetch available slots for selected date
  const {
    data: availabilityData,
    isLoading,
    error,
    refetch,
  } = useGHLAvailability({
    calendarId,
    startDate: formattedDate,
    timezone,
  })

  const slots = availabilityData?.slots || []

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      onSelectDate?.(newDate)
    }
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    onSelectSlot(slot)
  }

  const handleRefresh = () => {
    refetch()
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Date Selection */}
      {showCalendar && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Select Date</h3>
          </div>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(date) => date < minDate}
              className="rounded-md border"
            />
          </div>
        </div>
      )}

      {/* Selected Date Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">
              Available Times for {format(date, "MMMM d, yyyy")}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw
              className={cn("h-4 w-4", isLoading && "animate-spin")}
            />
            Refresh
          </Button>
        </div>

        {/* Time Slots */}
        <ScrollArea className="h-[400px] rounded-md border p-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState error={error} onRetry={handleRefresh} />
          ) : (
            <GHLTimeSlotGrid
              slots={slots}
              onSelect={handleSlotSelect}
              selectedSlot={selectedSlot}
              date={date}
            />
          )}
        </ScrollArea>
      </div>

      {/* Selected Slot Summary */}
      {selectedSlot && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Appointment</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {format(new Date(selectedSlot.startTime), "h:mm a")} -{" "}
                {format(new Date(selectedSlot.endTime), "h:mm a")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Loading skeleton component
 */
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-6 w-24" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-28" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Error state component
 */
function ErrorState({
  error,
  onRetry,
}: {
  error: Error
  onRetry: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-destructive">
          Failed to load availability
        </p>
        <p className="text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred"}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCcw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  )
}
