"use client"

import * as React from "react"
import { CalendarX2 } from "lucide-react"
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isThisWeek,
  startOfDay,
  differenceInDays,
} from "date-fns"

import { useGHLAppointments } from "@/hooks/use-ghl-appointments"
import { GHLAppointmentCard, type Appointment } from "./ghl-appointment-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export interface GHLAppointmentListProps {
  calendarId?: string
  locationId?: string
  startDate?: string
  endDate?: string
  onSelect?: (appointment: Appointment) => void
  selectedId?: string
  onCancel?: (appointmentId: string) => void
  onReschedule?: (appointmentId: string) => void
  className?: string
}

// Group appointments by date category
function groupAppointmentsByDate(appointments: Appointment[]) {
  const groups: Record<string, Appointment[]> = {
    Today: [],
    Tomorrow: [],
    "This Week": [],
    "Next Week": [],
    Later: [],
  }

  appointments.forEach((apt) => {
    const date = parseISO(apt.startTime)
    const today = startOfDay(new Date())
    const daysDiff = differenceInDays(date, today)

    if (isToday(date)) {
      groups.Today.push(apt)
    } else if (isTomorrow(date)) {
      groups.Tomorrow.push(apt)
    } else if (isThisWeek(date)) {
      groups["This Week"].push(apt)
    } else if (daysDiff <= 14) {
      groups["Next Week"].push(apt)
    } else {
      groups.Later.push(apt)
    }
  })

  return groups
}

export function GHLAppointmentList({
  calendarId,
  locationId,
  startDate,
  endDate,
  onSelect,
  selectedId,
  onCancel,
  onReschedule,
  className,
}: GHLAppointmentListProps) {
  const {
    data,
    isLoading,
    error,
  } = useGHLAppointments(
    {
      calendarId,
      locationId,
      startDate,
      endDate,
    },
    {
      enabled: !!(calendarId || locationId),
    }
  )

  const appointments = React.useMemo(() => {
    const events = (data as any)?.events
    if (!events) return []
    // Sort by start time
    return [...events].sort((a: Appointment, b: Appointment) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
  }, [data])

  const groupedAppointments = React.useMemo(() => {
    return groupAppointmentsByDate(appointments)
  }, [appointments])

  const handleCardClick = React.useCallback(
    (appointment: Appointment) => {
      if (onSelect) {
        onSelect(appointment)
      }
    },
    [onSelect]
  )

  // Loading state
  if (isLoading) {
    return (
      <div className={className}>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarX2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Error loading appointments</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : "Failed to load appointments"}
          </p>
        </div>
      </div>
    )
  }

  // Empty state
  if (appointments.length === 0) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarX2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No appointments</h3>
          <p className="text-sm text-muted-foreground mt-2">
            There are no appointments in the selected date range.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className={className}>
      <div className="space-y-6 pr-4">
        {Object.entries(groupedAppointments).map(([group, groupAppointments]) => {
          if (groupAppointments.length === 0) return null

          return (
            <div key={group} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {group}
                </h3>
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {groupAppointments.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {groupAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`cursor-pointer transition-all ${
                      selectedId === appointment.id
                        ? "ring-2 ring-primary ring-offset-2 rounded-lg"
                        : "hover:ring-1 hover:ring-muted-foreground/20 rounded-lg"
                    }`}
                    onClick={() => handleCardClick(appointment)}
                  >
                    <GHLAppointmentCard
                      appointment={appointment}
                      onCancel={onCancel}
                      onReschedule={onReschedule}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
