"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useGHLBookAppointment } from "@/hooks/use-ghl-book-appointment"
import { useGHLContact } from "@/hooks/use-ghl-contact"
import { GHLCalendarSelect } from "./ghl-calendar-select"
import { GHLAvailabilityPicker } from "./ghl-availability-picker"
import type { TimeSlot } from "./ghl-time-slot-grid"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Clock,
  User,
  Loader2,
} from "lucide-react"

/**
 * Props for the GHLBookingWidget component
 */
export interface GHLBookingWidgetProps {
  /**
   * The location ID
   */
  locationId: string
  /**
   * Pre-selected calendar ID (skips step 1 if provided)
   */
  calendarId?: string
  /**
   * Pre-fill contact info from an existing contact
   */
  contactId?: string
  /**
   * Callback on successful booking
   */
  onSuccess?: (data: unknown) => void
  /**
   * Callback when cancelled
   */
  onCancel?: () => void
  /**
   * Additional CSS classes
   */
  className?: string
}

/** Step definitions */
const STEPS = [
  { id: 1, label: "Calendar", icon: Calendar },
  { id: 2, label: "Date & Time", icon: Clock },
  { id: 3, label: "Contact Info", icon: User },
  { id: 4, label: "Confirm", icon: Check },
] as const

/**
 * Format a time string for display
 */
function formatSlotTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  } catch {
    return isoString
  }
}

/**
 * Format a date for display
 */
function formatSlotDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return isoString
  }
}

/**
 * Multi-step booking wizard for GoHighLevel calendars
 *
 * Steps: Select Calendar -> Pick Date/Time -> Contact Info -> Confirmation.
 * Skips step 1 if calendarId is provided. Pre-fills contact info if contactId is provided.
 *
 * @example
 * ```tsx
 * <GHLBookingWidget
 *   locationId="loc_123"
 *   calendarId="cal_456"
 *   onSuccess={(data) => console.log("Booked!", data)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Full wizard with calendar selection
 * <GHLBookingWidget
 *   locationId="loc_123"
 *   onSuccess={(data) => toast.success("Appointment booked")}
 *   onCancel={() => router.back()}
 * />
 * ```
 */
export function GHLBookingWidget({
  locationId,
  calendarId,
  contactId,
  onSuccess,
  onCancel,
  className,
}: GHLBookingWidgetProps) {
  const [step, setStep] = React.useState(calendarId ? 2 : 1)
  const [selectedCalendarId, setSelectedCalendarId] = React.useState(
    calendarId || ""
  )
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>()
  const [contactInfo, setContactInfo] = React.useState({
    name: "",
    email: "",
    phone: "",
  })
  const [bookingError, setBookingError] = React.useState<string | null>(null)

  // Fetch contact info if contactId provided
  const { contact } = useGHLContact(contactId, {
    enabled: !!contactId,
  })

  // Pre-fill contact info when contact data loads
  React.useEffect(() => {
    if (contact) {
      const typedContact = contact as {
        firstName?: string
        lastName?: string
        name?: string
        email?: string
        phone?: string
      }
      setContactInfo({
        name:
          [typedContact.firstName, typedContact.lastName]
            .filter(Boolean)
            .join(" ") ||
          typedContact.name ||
          "",
        email: typedContact.email || "",
        phone: typedContact.phone || "",
      })
    }
  }, [contact])

  // Book appointment mutation
  const {
    mutateAsync: bookAppointment,
    isLoading: isBooking,
  } = useGHLBookAppointment()

  // Determine which steps are visible
  const visibleSteps = calendarId ? STEPS.filter((s) => s.id !== 1) : STEPS

  // Navigation
  const canGoNext = (): boolean => {
    switch (step) {
      case 1:
        return !!selectedCalendarId
      case 2:
        return !!selectedSlot
      case 3:
        return !!contactInfo.name.trim() && !!contactInfo.email.trim()
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canGoNext() && step < 4) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > (calendarId ? 2 : 1)) {
      setStep(step - 1)
    }
  }

  const handleBook = async () => {
    if (!selectedSlot || !selectedCalendarId) return

    setBookingError(null)

    try {
      const result = await bookAppointment({
        calendarId: selectedCalendarId,
        locationId,
        contactId: contactId || undefined,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        firstName: contactInfo.name.split(" ")[0] || contactInfo.name,
        lastName: contactInfo.name.split(" ").slice(1).join(" ") || undefined,
        email: contactInfo.email,
        phone: contactInfo.phone || undefined,
        title: `Booking for ${contactInfo.name}`,
      })
      onSuccess?.(result)
    } catch (err) {
      setBookingError(
        err instanceof Error ? err.message : "Failed to book appointment"
      )
    }
  }

  return (
    <Card className={cn("w-full max-w-lg", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Book an Appointment</CardTitle>
        {/* Step indicator */}
        <div className="flex items-center gap-2 pt-2">
          {visibleSteps.map((s, i) => {
            const StepIcon = s.icon
            const isActive = step === s.id
            const isCompleted = step > s.id

            return (
              <React.Fragment key={s.id}>
                {i > 0 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-medium",
                    isActive
                      ? "text-primary"
                      : isCompleted
                        ? "text-primary"
                        : "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center h-6 w-6 rounded-full border",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <StepIcon className="h-3 w-3" />
                    )}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="min-h-[300px]">
        {/* Step 1: Select Calendar */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a calendar for your appointment.
            </p>
            <GHLCalendarSelect
              locationId={locationId}
              value={selectedCalendarId}
              onChange={(id) => setSelectedCalendarId(id)}
              className="w-full"
            />
          </div>
        )}

        {/* Step 2: Pick Date & Time */}
        {step === 2 && selectedCalendarId && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select a date and available time slot.
            </p>
            <GHLAvailabilityPicker
              calendarId={selectedCalendarId}
              selectedDate={selectedDate}
              onSelectDate={(date) => setSelectedDate(date)}
              onSelectSlot={(slot) => setSelectedSlot(slot)}
              selectedSlot={selectedSlot || undefined}
            />
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your contact details.
            </p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="booking-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="booking-name"
                  value={contactInfo.name}
                  onChange={(e) =>
                    setContactInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="booking-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="booking-email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) =>
                    setContactInfo((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="booking-phone">Phone</Label>
                <Input
                  id="booking-phone"
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) =>
                    setContactInfo((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Review your booking details.
            </p>
            <div className="rounded-lg border p-4 space-y-3">
              {selectedSlot && (
                <>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {formatSlotDate(selectedSlot.startTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatSlotTime(selectedSlot.startTime)} &ndash;{" "}
                      {formatSlotTime(selectedSlot.endTime)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{contactInfo.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {contactInfo.email}
                {contactInfo.phone && ` | ${contactInfo.phone}`}
              </p>
            </div>

            {bookingError && (
              <Alert variant="destructive">
                <AlertDescription>{bookingError}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div>
          {step > (calendarId ? 2 : 1) ? (
            <Button variant="outline" onClick={handleBack} disabled={isBooking}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          ) : onCancel ? (
            <Button variant="ghost" onClick={onCancel} disabled={isBooking}>
              Cancel
            </Button>
          ) : null}
        </div>

        <div>
          {step < 4 ? (
            <Button onClick={handleNext} disabled={!canGoNext()}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleBook} disabled={isBooking}>
              {isBooking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Book Appointment
                </>
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
