import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useState } from "react"
import { GHLTimeSlotGrid, TimeSlot } from "./ghl-time-slot-grid"

// Generate mock time slots for a given date
const generateMockSlots = (date: Date, timeOfDay: "full" | "morning" | "afternoon" | "evening" = "full"): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const baseDate = new Date(date)

  const ranges = {
    morning: { start: 9, end: 12 },
    afternoon: { start: 13, end: 17 },
    evening: { start: 18, end: 21 },
    full: { start: 9, end: 21 },
  }

  const { start, end } = ranges[timeOfDay]

  for (let hour = start; hour < end; hour++) {
    const startTime = new Date(baseDate)
    startTime.setHours(hour, 0, 0, 0)

    const endTime = new Date(baseDate)
    endTime.setHours(hour, 30, 0, 0)

    slots.push({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    })

    // Add half-hour slot
    if (hour < end - 1 || timeOfDay === "full") {
      const halfStartTime = new Date(baseDate)
      halfStartTime.setHours(hour, 30, 0, 0)

      const halfEndTime = new Date(baseDate)
      halfEndTime.setHours(hour + 1, 0, 0, 0)

      slots.push({
        startTime: halfStartTime.toISOString(),
        endTime: halfEndTime.toISOString(),
      })
    }
  }

  return slots
}

// Tomorrow's date for future slots
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(0, 0, 0, 0)

// Yesterday's date for past slots demo
const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
yesterday.setHours(0, 0, 0, 0)

const meta: Meta<typeof GHLTimeSlotGrid> = {
  title: "Calendars/GHLTimeSlotGrid",
  component: GHLTimeSlotGrid,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onSelect: { action: "slot selected" },
    date: {
      control: "date",
      description: "Date for the time slots",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof GHLTimeSlotGrid>

export const Default: Story = {
  args: {
    slots: generateMockSlots(tomorrow),
    date: tomorrow,
    onSelect: (slot) => console.log("Selected slot:", slot),
  },
}

export const MorningOnly: Story = {
  args: {
    slots: generateMockSlots(tomorrow, "morning"),
    date: tomorrow,
    onSelect: (slot) => console.log("Selected slot:", slot),
  },
}

export const AfternoonOnly: Story = {
  args: {
    slots: generateMockSlots(tomorrow, "afternoon"),
    date: tomorrow,
    onSelect: (slot) => console.log("Selected slot:", slot),
  },
}

export const EveningOnly: Story = {
  args: {
    slots: generateMockSlots(tomorrow, "evening"),
    date: tomorrow,
    onSelect: (slot) => console.log("Selected slot:", slot),
  },
}

export const NoSlots: Story = {
  args: {
    slots: [],
    date: tomorrow,
    onSelect: (slot) => console.log("Selected slot:", slot),
  },
}

export const LimitedSlots: Story = {
  args: {
    slots: [
      {
        startTime: new Date(tomorrow.setHours(10, 0, 0, 0)).toISOString(),
        endTime: new Date(tomorrow.setHours(10, 30, 0, 0)).toISOString(),
      },
      {
        startTime: new Date(tomorrow.setHours(14, 0, 0, 0)).toISOString(),
        endTime: new Date(tomorrow.setHours(14, 30, 0, 0)).toISOString(),
      },
      {
        startTime: new Date(tomorrow.setHours(19, 0, 0, 0)).toISOString(),
        endTime: new Date(tomorrow.setHours(19, 30, 0, 0)).toISOString(),
      },
    ],
    date: tomorrow,
    onSelect: (slot) => console.log("Selected slot:", slot),
  },
}

// Interactive story with selection state
const InteractiveTemplate = () => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>()
  const slots = generateMockSlots(tomorrow)

  return (
    <div className="space-y-4">
      <GHLTimeSlotGrid
        slots={slots}
        date={tomorrow}
        selectedSlot={selectedSlot}
        onSelect={setSelectedSlot}
      />
      {selectedSlot && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium">Selected Slot:</p>
          <p className="text-sm text-muted-foreground">
            {new Date(selectedSlot.startTime).toLocaleTimeString()} -{" "}
            {new Date(selectedSlot.endTime).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveTemplate />,
}

export const WithPastSlots: Story = {
  args: {
    slots: generateMockSlots(yesterday),
    date: yesterday,
    onSelect: (slot) => console.log("Selected slot:", slot),
  },
}
