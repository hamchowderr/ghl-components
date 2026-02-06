"use client"

import * as React from "react"
import { GHLProvider } from "@/registry/new-york/auth/ghl-provider"
import { GHLAvailabilityPicker } from "@/registry/new-york/calendars/ghl-availability-picker"
import { GHLTimeSlotGrid, type TimeSlot } from "@/registry/new-york/calendars/ghl-time-slot-grid"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * Example 1: Basic Availability Picker
 *
 * Simple example showing how to use the GHLAvailabilityPicker component
 * to let users select a date and time slot.
 */
export function BasicAvailabilityPickerExample() {
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot>()

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    console.log("Selected slot:", slot)
  }

  return (
    <GHLProvider>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription>
            Select a date and time that works for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GHLAvailabilityPicker
            calendarId="your-calendar-id"
            onSelectSlot={handleSlotSelect}
            selectedSlot={selectedSlot}
            timezone="America/New_York"
          />
        </CardContent>
      </Card>
    </GHLProvider>
  )
}

/**
 * Example 2: Time Slot Grid Only
 *
 * Example showing how to use just the GHLTimeSlotGrid component
 * for displaying time slots in a grid layout.
 */
export function TimeSlotGridExample() {
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot>()

  // Example slots data
  const slots: TimeSlot[] = [
    { startTime: "2024-01-15T09:00:00Z", endTime: "2024-01-15T09:30:00Z" },
    { startTime: "2024-01-15T09:30:00Z", endTime: "2024-01-15T10:00:00Z" },
    { startTime: "2024-01-15T10:00:00Z", endTime: "2024-01-15T10:30:00Z" },
    { startTime: "2024-01-15T13:00:00Z", endTime: "2024-01-15T13:30:00Z" },
    { startTime: "2024-01-15T14:00:00Z", endTime: "2024-01-15T14:30:00Z" },
    { startTime: "2024-01-15T18:00:00Z", endTime: "2024-01-15T18:30:00Z" },
  ]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Available Time Slots</CardTitle>
        <CardDescription>Monday, January 15, 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <GHLTimeSlotGrid
          slots={slots}
          onSelect={setSelectedSlot}
          selectedSlot={selectedSlot}
          date={new Date("2024-01-15")}
        />
      </CardContent>
    </Card>
  )
}

/**
 * Example 3: Custom Availability Picker with Booking Flow
 *
 * Complete example showing a multi-step booking flow with
 * availability selection and confirmation.
 */
export function BookingFlowExample() {
  const [step, setStep] = React.useState<"select" | "confirm">("select")
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot>()

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
  }

  const handleConfirm = () => {
    setStep("confirm")
  }

  const handleBack = () => {
    setStep("select")
  }

  const handleBookAppointment = async () => {
    if (!selectedSlot) return

    // Here you would call the GHL API to create the appointment
    console.log("Booking appointment:", {
      date: selectedDate,
      slot: selectedSlot,
    })

    // Example API call:
    // await client.calendars.createAppointment({
    //   calendarId: "your-calendar-id",
    //   startTime: selectedSlot.startTime,
    //   endTime: selectedSlot.endTime,
    //   // ... other appointment details
    // })
  }

  return (
    <GHLProvider>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {step === "select" ? "Select Appointment Time" : "Confirm Booking"}
          </CardTitle>
          <CardDescription>
            {step === "select"
              ? "Choose a date and time that works for you"
              : "Review your appointment details"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "select" ? (
            <>
              <GHLAvailabilityPicker
                calendarId="your-calendar-id"
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onSelectSlot={handleSlotSelect}
                selectedSlot={selectedSlot}
                timezone="America/New_York"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleConfirm}
                  disabled={!selectedSlot}
                  size="lg"
                >
                  Continue to Confirmation
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h3 className="font-semibold mb-2">Appointment Details</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Date:</dt>
                      <dd className="font-medium">
                        {selectedDate.toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Time:</dt>
                      <dd className="font-medium">
                        {selectedSlot &&
                          new Date(selectedSlot.startTime).toLocaleTimeString(
                            [],
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}{" "}
                        -{" "}
                        {selectedSlot &&
                          new Date(selectedSlot.endTime).toLocaleTimeString(
                            [],
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleBookAppointment} className="flex-1">
                  Confirm Appointment
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </GHLProvider>
  )
}

/**
 * Example 4: Customized Availability Picker
 *
 * Example showing various customization options for the
 * GHLAvailabilityPicker component.
 */
export function CustomizedAvailabilityPickerExample() {
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot>()

  // Only allow booking from tomorrow onwards
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  return (
    <GHLProvider>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Schedule Consultation</CardTitle>
          <CardDescription>
            Book your 30-minute consultation call
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GHLAvailabilityPicker
            calendarId="your-calendar-id"
            onSelectSlot={setSelectedSlot}
            selectedSlot={selectedSlot}
            timezone="America/Los_Angeles"
            minDate={tomorrow}
            showCalendar={true}
          />
        </CardContent>
      </Card>
    </GHLProvider>
  )
}
