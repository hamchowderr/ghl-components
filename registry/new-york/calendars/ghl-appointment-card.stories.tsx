import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { GHLAppointmentCard, Appointment } from "./ghl-appointment-card"

// Create a mock appointment for tomorrow
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(10, 0, 0, 0)

const tomorrowEnd = new Date(tomorrow)
tomorrowEnd.setHours(11, 0, 0, 0)

const mockAppointment: Appointment = {
  id: "appt-123",
  title: "Initial Consultation",
  startTime: tomorrow.toISOString(),
  endTime: tomorrowEnd.toISOString(),
  appointmentStatus: "confirmed",
  contactId: "contact-456",
  calendarId: "cal-789",
  address: "123 Main St, Suite 100, New York, NY 10001",
  notes: "Please bring any relevant documents for the consultation.",
}

const meta: Meta<typeof GHLAppointmentCard> = {
  title: "Calendars/GHLAppointmentCard",
  component: GHLAppointmentCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onCancel: { action: "cancel clicked" },
    onReschedule: { action: "reschedule clicked" },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof GHLAppointmentCard>

export const Confirmed: Story = {
  args: {
    appointment: mockAppointment,
  },
}

export const Cancelled: Story = {
  args: {
    appointment: {
      ...mockAppointment,
      appointmentStatus: "cancelled",
      title: "Cancelled Meeting",
    },
  },
}

export const Showed: Story = {
  args: {
    appointment: {
      ...mockAppointment,
      appointmentStatus: "showed",
      title: "Completed Consultation",
    },
  },
}

export const NoShow: Story = {
  args: {
    appointment: {
      ...mockAppointment,
      appointmentStatus: "noshow",
      title: "Missed Appointment",
    },
  },
}

export const WithActions: Story = {
  args: {
    appointment: mockAppointment,
    onCancel: (id) => console.log("Cancel:", id),
    onReschedule: (id) => console.log("Reschedule:", id),
  },
}

export const WithoutAddress: Story = {
  args: {
    appointment: {
      ...mockAppointment,
      address: undefined,
      title: "Virtual Meeting",
    },
  },
}

export const WithoutNotes: Story = {
  args: {
    appointment: {
      ...mockAppointment,
      notes: undefined,
    },
  },
}

export const MinimalAppointment: Story = {
  args: {
    appointment: {
      id: "appt-min",
      title: "Quick Call",
      startTime: tomorrow.toISOString(),
      endTime: tomorrowEnd.toISOString(),
      appointmentStatus: "confirmed",
    },
  },
}

export const LongTitle: Story = {
  args: {
    appointment: {
      ...mockAppointment,
      title: "Extended Strategy Planning Session with Marketing Team",
    },
  },
}

export const WithLongAddress: Story = {
  args: {
    appointment: {
      ...mockAppointment,
      address:
        "The Empire State Building, 350 Fifth Avenue, Floor 102, Conference Room B, New York, NY 10118, United States",
    },
  },
}

export const WithLongNotes: Story = {
  args: {
    appointment: {
      ...mockAppointment,
      notes:
        "Please prepare the following documents for review: Q4 financial report, marketing budget proposal, customer feedback summary, and the updated project timeline. We will also discuss the upcoming product launch and review the competitive analysis prepared by the research team.",
    },
  },
}

// Multiple appointments showcase
export const AppointmentList: Story = {
  render: () => {
    const appointments: Appointment[] = [
      {
        id: "1",
        title: "Morning Stand-up",
        startTime: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          9,
          0
        ).toISOString(),
        endTime: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          9,
          15
        ).toISOString(),
        appointmentStatus: "confirmed",
      },
      {
        id: "2",
        title: "Client Presentation",
        startTime: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          10,
          0
        ).toISOString(),
        endTime: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          11,
          30
        ).toISOString(),
        appointmentStatus: "confirmed",
        address: "Conference Room A",
        notes: "Bring demo materials",
      },
      {
        id: "3",
        title: "Lunch Meeting",
        startTime: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          12,
          0
        ).toISOString(),
        endTime: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          13,
          0
        ).toISOString(),
        appointmentStatus: "showed",
        address: "Downtown Restaurant",
      },
    ]

    return (
      <div className="space-y-4">
        {appointments.map((appt) => (
          <GHLAppointmentCard
            key={appt.id}
            appointment={appt}
            onCancel={(id) => console.log("Cancel:", id)}
            onReschedule={(id) => console.log("Reschedule:", id)}
          />
        ))}
      </div>
    )
  },
}
