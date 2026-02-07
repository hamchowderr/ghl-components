"use client"

import * as React from "react"
import { MoreVertical, Calendar, Clock, User, MapPin } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { GHLAppointmentStatus } from "@/registry/new-york/server/types/calendar"

export interface Appointment {
  id: string
  title?: string
  startTime: string
  endTime: string
  appointmentStatus?: string
  contactId?: string
  calendarId?: string
  address?: string
  notes?: string
  [key: string]: unknown
}

export interface GHLAppointmentCardProps {
  appointment: Appointment
  onCancel?: (appointmentId: string) => void
  onReschedule?: (appointmentId: string) => void
  className?: string
}

// Status badge variants and labels
const statusConfig: Record<
  GHLAppointmentStatus,
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
> = {
  confirmed: { variant: "default", label: "Confirmed" },
  cancelled: { variant: "destructive", label: "Cancelled" },
  showed: { variant: "secondary", label: "Showed" },
  noshow: { variant: "outline", label: "No Show" },
  invalid: { variant: "destructive", label: "Invalid" },
}

export function GHLAppointmentCard({
  appointment,
  onCancel,
  onReschedule,
  className,
}: GHLAppointmentCardProps) {

  // Format date and time
  const formattedDate = React.useMemo(() => {
    if (!appointment?.startTime) return null
    try {
      return format(parseISO(appointment.startTime), "EEEE, MMMM d, yyyy")
    } catch {
      return null
    }
  }, [appointment?.startTime])

  const formattedTime = React.useMemo(() => {
    if (!appointment?.startTime || !appointment?.endTime) return null
    try {
      const start = format(parseISO(appointment.startTime), "h:mm a")
      const end = format(parseISO(appointment.endTime), "h:mm a")
      return `${start} - ${end}`
    } catch {
      return null
    }
  }, [appointment?.startTime, appointment?.endTime])

  // Handle menu actions
  const handleCancel = React.useCallback(() => {
    if (appointment && onCancel) {
      onCancel(appointment.id)
    }
  }, [appointment, onCancel])

  const handleReschedule = React.useCallback(() => {
    if (appointment && onReschedule) {
      onReschedule(appointment.id)
    }
  }, [appointment, onReschedule])

  // No appointment data
  if (!appointment) {
    return (
      <Alert className={className}>
        <AlertTitle>No appointment found</AlertTitle>
        <AlertDescription>
          The requested appointment could not be found.
        </AlertDescription>
      </Alert>
    )
  }

  const statusInfo = statusConfig[appointment.appointmentStatus as GHLAppointmentStatus] || statusConfig.invalid

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar className="h-12 w-12">
          <AvatarFallback>
            <Calendar className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{appointment.title}</CardTitle>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          {appointment.contactId && (
            <CardDescription className="flex items-center gap-1 mt-1">
              <User className="h-3 w-3" />
              Contact ID: {appointment.contactId}
            </CardDescription>
          )}
        </div>
        {(onCancel || onReschedule) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Appointment actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onReschedule && (
                <DropdownMenuItem onClick={handleReschedule}>
                  Reschedule
                </DropdownMenuItem>
              )}
              {onCancel && (
                <DropdownMenuItem
                  onClick={handleCancel}
                  className="text-destructive"
                >
                  Cancel
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {formattedDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>
        )}
        {formattedTime && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formattedTime}</span>
          </div>
        )}
        {appointment.address && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{appointment.address}</span>
          </div>
        )}
        {appointment.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">{appointment.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
