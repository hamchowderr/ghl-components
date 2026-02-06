"use client"

import * as React from "react"
import { Loader2, Calendar as CalendarIcon } from "lucide-react"
import { z } from "zod"
import { toast } from "sonner"
import { format } from "date-fns"

import { useGHLBookAppointment } from "@/hooks/use-ghl-book-appointment"
import { useGHLContact } from "@/hooks/use-ghl-contact"
import { GHLCalendarSelect } from "@/registry/new-york/calendars/ghl-calendar-select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Booking form validation schema
const bookingFormSchema = z.object({
  calendarId: z.string().min(1, "Calendar is required"),
  selectedDate: z.date({
    required_error: "Date is required",
  }),
  selectedTime: z.string().min(1, "Time slot is required"),
  title: z.string().optional(),
  contactName: z.string().min(1, "Name is required").optional(),
  contactEmail: z.string().email("Invalid email").optional(),
  contactPhone: z.string().optional(),
  notes: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingFormSchema>

export interface GHLBookingFormProps {
  /**
   * Location ID for booking the appointment (required)
   */
  locationId: string
  /**
   * Optional pre-selected calendar ID. If not provided, user must select from available calendars.
   */
  calendarId?: string
  /**
   * Optional contact ID. If provided, contact info will be fetched and displayed.
   * If not provided, user must fill in contact information.
   */
  contactId?: string
  /**
   * Callback fired when the appointment is successfully booked
   */
  onSuccess?: (appointment: unknown) => void
  /**
   * Callback fired when the cancel button is clicked
   */
  onCancel?: () => void
  /**
   * Custom form title
   */
  title?: string
  /**
   * Custom form description
   */
  description?: string
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Default appointment duration in minutes (default: 60)
   */
  defaultDuration?: number
  /**
   * Available time slots (default: 9 AM to 5 PM in 30-minute intervals)
   */
  timeSlots?: string[]
}

// Default time slots: 9 AM to 5 PM in 30-minute intervals
const DEFAULT_TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
]

export function GHLBookingForm({
  locationId,
  calendarId: initialCalendarId,
  contactId,
  onSuccess,
  onCancel,
  title,
  description,
  className,
  defaultDuration = 60,
  timeSlots = DEFAULT_TIME_SLOTS,
}: GHLBookingFormProps) {
  // Fetch contact data if contactId is provided
  const { data: contactData, isLoading: isLoadingContact } = useGHLContact(
    contactId,
    { enabled: !!contactId }
  )

  // Mutation for booking appointment
  const { mutate: bookAppointment, isPending: isBooking } =
    useGHLBookAppointment()

  // Form state
  const [selectedCalendarId, setSelectedCalendarId] = React.useState<
    string | undefined
  >(initialCalendarId)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    undefined
  )
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(
    undefined
  )
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)

  // Form field state
  const [formState, setFormState] = React.useState<{
    errors: Partial<Record<keyof BookingFormData, string>>
    submitError: string | null
  }>({
    errors: {},
    submitError: null,
  })

  // Populate contact info if contactData is available
  const contact = React.useMemo(() => {
    if (!contactData) return null
    const data = contactData as any
    return {
      name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
      email: data.email || "",
      phone: data.phone || "",
    }
  }, [contactData])

  // Handle form submission
  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const formData = new FormData(e.target as HTMLFormElement)

      // Build form data object
      const data: Partial<BookingFormData> = {
        calendarId: selectedCalendarId,
        selectedDate,
        selectedTime,
        title: (formData.get("title") as string) || undefined,
        contactName: contactId
          ? contact?.name
          : (formData.get("contactName") as string) || undefined,
        contactEmail: contactId
          ? contact?.email
          : (formData.get("contactEmail") as string) || undefined,
        contactPhone: contactId
          ? contact?.phone
          : (formData.get("contactPhone") as string) || undefined,
        notes: (formData.get("notes") as string) || undefined,
      }

      // Additional validation for contact info when contactId is not provided
      if (!contactId) {
        if (!data.contactName || data.contactName.trim() === "") {
          setFormState((prev) => ({
            ...prev,
            errors: { ...prev.errors, contactName: "Name is required" },
          }))
          return
        }
        if (!data.contactEmail || data.contactEmail.trim() === "") {
          setFormState((prev) => ({
            ...prev,
            errors: { ...prev.errors, contactEmail: "Email is required" },
          }))
          return
        }
      }

      // Validate with Zod
      const result = bookingFormSchema.safeParse(data)

      if (!result.success) {
        setFormState((prev) => ({
          ...prev,
          errors: Object.fromEntries(
            Object.entries(result.error.flatten().fieldErrors).map(
              ([key, value]) => [key, value?.[0] ?? ""]
            )
          ) as Partial<Record<keyof BookingFormData, string>>,
          submitError: null,
        }))
        return
      }

      // Clear errors
      setFormState({
        errors: {},
        submitError: null,
      })

      // Calculate start and end times
      const [hours, minutes] = result.data.selectedTime.split(":").map(Number)
      const startTime = new Date(result.data.selectedDate)
      startTime.setHours(hours, minutes, 0, 0)

      const endTime = new Date(startTime)
      endTime.setMinutes(endTime.getMinutes() + defaultDuration)

      // Prepare appointment data
      const appointmentData = {
        calendarId: result.data.calendarId,
        locationId,
        contactId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        title: result.data.title || "Appointment",
        description: result.data.notes,
        email: result.data.contactEmail,
        phone: result.data.contactPhone,
        firstName: result.data.contactName?.split(" ")[0],
        lastName: result.data.contactName?.split(" ").slice(1).join(" "),
      }

      // Submit booking
      bookAppointment(appointmentData, {
        onSuccess: (appointment) => {
          toast.success("Appointment booked successfully")

          // Reset form
          const form = e.target as HTMLFormElement
          form.reset()
          setSelectedCalendarId(initialCalendarId)
          setSelectedDate(undefined)
          setSelectedTime(undefined)
          setFormState({
            errors: {},
            submitError: null,
          })

          onSuccess?.(appointment)
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to book appointment"
          setFormState((prev) => ({
            ...prev,
            submitError: errorMessage,
          }))
          toast.error(errorMessage)
        },
      })
    },
    [
      selectedCalendarId,
      selectedDate,
      selectedTime,
      contactId,
      contact,
      locationId,
      defaultDuration,
      initialCalendarId,
      bookAppointment,
      onSuccess,
    ]
  )

  const isPending = isBooking || isLoadingContact

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Card>
        <CardHeader>
          <CardTitle>{title || "Book Appointment"}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Submit Error Alert */}
          {formState.submitError && (
            <Alert variant="destructive">
              <AlertDescription>{formState.submitError}</AlertDescription>
            </Alert>
          )}

          {/* Calendar Selection */}
          {!initialCalendarId && (
            <div
              className="group/field grid gap-2"
              data-invalid={!!formState.errors?.calendarId}
            >
              <Label
                htmlFor="calendarId"
                className="group-data-[invalid=true]/field:text-destructive"
              >
                Calendar <span className="text-destructive">*</span>
              </Label>
              <GHLCalendarSelect
                locationId={locationId}
                value={selectedCalendarId}
                onChange={setSelectedCalendarId}
                placeholder="Select a calendar..."
                className={cn(
                  formState.errors?.calendarId &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
              {formState.errors?.calendarId && (
                <p className="text-destructive text-sm">
                  {formState.errors.calendarId}
                </p>
              )}
            </div>
          )}

          {/* Date Selection */}
          <div
            className="group/field grid gap-2"
            data-invalid={!!formState.errors?.selectedDate}
          >
            <Label
              htmlFor="selectedDate"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Date <span className="text-destructive">*</span>
            </Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                    formState.errors?.selectedDate &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={isPending}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    setDatePickerOpen(false)
                  }}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formState.errors?.selectedDate && (
              <p className="text-destructive text-sm">
                {formState.errors.selectedDate}
              </p>
            )}
          </div>

          {/* Time Slot Selection */}
          <div
            className="group/field grid gap-2"
            data-invalid={!!formState.errors?.selectedTime}
          >
            <Label
              htmlFor="selectedTime"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Time Slot <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  disabled={isPending}
                  className="text-sm"
                >
                  {time}
                </Button>
              ))}
            </div>
            {formState.errors?.selectedTime && (
              <p className="text-destructive text-sm">
                {formState.errors.selectedTime}
              </p>
            )}
          </div>

          {/* Appointment Title */}
          <div className="group/field grid gap-2">
            <Label htmlFor="title">Appointment Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Consultation (optional)"
              disabled={isPending}
              defaultValue=""
            />
            <p className="text-xs text-muted-foreground">
              Defaults to &quot;Appointment&quot; if not provided
            </p>
          </div>

          {/* Contact Information Section */}
          {contactId && contact ? (
            // Display contact info if contactId is provided
            <div className="grid gap-2">
              <Label>Contact Information</Label>
              <div className="rounded-md border p-4 space-y-2">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {contact.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {contact.email || "N/A"}
                  </p>
                </div>
                {contact.phone && (
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Show contact input fields if no contactId
            <>
              {/* Contact Name */}
              <div
                className="group/field grid gap-2"
                data-invalid={!!formState.errors?.contactName}
              >
                <Label
                  htmlFor="contactName"
                  className="group-data-[invalid=true]/field:text-destructive"
                >
                  Your Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactName"
                  name="contactName"
                  placeholder="John Doe"
                  className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                  disabled={isPending}
                  aria-invalid={!!formState.errors?.contactName}
                  aria-errormessage="error-contactName"
                />
                {formState.errors?.contactName && (
                  <p id="error-contactName" className="text-destructive text-sm">
                    {formState.errors.contactName}
                  </p>
                )}
              </div>

              {/* Contact Email */}
              <div
                className="group/field grid gap-2"
                data-invalid={!!formState.errors?.contactEmail}
              >
                <Label
                  htmlFor="contactEmail"
                  className="group-data-[invalid=true]/field:text-destructive"
                >
                  Your Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  placeholder="john.doe@example.com"
                  className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                  disabled={isPending}
                  aria-invalid={!!formState.errors?.contactEmail}
                  aria-errormessage="error-contactEmail"
                />
                {formState.errors?.contactEmail && (
                  <p
                    id="error-contactEmail"
                    className="text-destructive text-sm"
                  >
                    {formState.errors.contactEmail}
                  </p>
                )}
              </div>

              {/* Contact Phone */}
              <div
                className="group/field grid gap-2"
                data-invalid={!!formState.errors?.contactPhone}
              >
                <Label htmlFor="contactPhone">Your Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  placeholder="+15551234567"
                  disabled={isPending}
                  aria-invalid={!!formState.errors?.contactPhone}
                  aria-errormessage="error-contactPhone"
                />
                {formState.errors?.contactPhone && (
                  <p
                    id="error-contactPhone"
                    className="text-destructive text-sm"
                  >
                    {formState.errors.contactPhone}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Optional</p>
              </div>
            </>
          )}

          {/* Additional Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any additional information or special requests..."
              disabled={isPending}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Optional</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Booking..." : "Book Appointment"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
