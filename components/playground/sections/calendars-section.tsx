"use client"

import * as React from "react"
import { DemoSection } from "../demo-section"
import { GHLAppointmentCard } from "@/registry/new-york/calendars/ghl-appointment-card"
import { GHLTimeSlotGrid } from "@/registry/new-york/calendars/ghl-time-slot-grid"
import { mockAppointments, mockTimeSlots } from "@/lib/showcase/mock-data"

export function CalendarsSection() {
  const [selectedSlot, setSelectedSlot] = React.useState<{ startTime: string; endTime: string } | undefined>()

  return (
    <DemoSection
      title="Calendars & Appointments"
      description="Booking forms, appointment cards, availability pickers, and time slot selection."
      category="calendars"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Appointment Cards</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockAppointments.slice(0, 3).map((appointment) => (
              <GHLAppointmentCard
                key={appointment.id}
                appointment={appointment}
                onReschedule={() => {}}
                onCancel={() => {}}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Time Slot Grid</h3>
          <div className="max-w-md">
            <GHLTimeSlotGrid
              slots={mockTimeSlots}
              date={new Date("2026-02-07")}
              selectedSlot={selectedSlot}
              onSelect={setSelectedSlot}
            />
          </div>
        </div>
      </div>
    </DemoSection>
  )
}
