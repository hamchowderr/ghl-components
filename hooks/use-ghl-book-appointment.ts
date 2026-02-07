"use client"

import { useGHLMutation } from "./use-ghl-mutation"

/**
 * Input data for booking a new appointment
 */
export interface BookAppointmentInput {
  /**
   * The calendar ID where the appointment will be booked
   */
  calendarId: string
  /**
   * The location ID for the appointment
   */
  locationId: string
  /**
   * The contact ID for the appointment
   */
  contactId?: string
  /**
   * Start time of the appointment (ISO 8601 format)
   * @example "2024-01-15T10:00:00Z"
   */
  startTime: string
  /**
   * End time of the appointment (ISO 8601 format)
   * @example "2024-01-15T11:00:00Z"
   */
  endTime: string
  /**
   * Appointment title
   */
  title?: string
  /**
   * Appointment description or notes
   */
  description?: string
  /**
   * Contact's email address (required if no contactId)
   */
  email?: string
  /**
   * Contact's phone number
   */
  phone?: string
  /**
   * Contact's first name
   */
  firstName?: string
  /**
   * Contact's last name
   */
  lastName?: string
  /**
   * Appointment status
   * @example "confirmed" | "pending" | "cancelled"
   */
  status?: string
  /**
   * Additional appointment data
   */
  [key: string]: unknown
}

/**
 * Hook to book a new appointment in GoHighLevel.
 * Wraps the `client.calendars.createEvent(data)` SDK method.
 *
 * Automatically invalidates the `['appointments']` and `['availability']` query cache on success,
 * triggering a refetch of any active appointment and availability queries.
 *
 * @returns Mutation object with mutate function, loading state, error, and data
 *
 * @example
 * ```tsx
 * function BookAppointmentForm() {
 *   const { mutate: bookAppointment, isLoading, error } = useGHLBookAppointment()
 *
 *   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 *     e.preventDefault()
 *     const formData = new FormData(e.currentTarget)
 *
 *     bookAppointment({
 *       calendarId: "cal_123",
 *       locationId: "loc_123",
 *       contactId: "con_123",
 *       startTime: "2024-01-15T10:00:00Z",
 *       endTime: "2024-01-15T11:00:00Z",
 *       title: "Consultation",
 *       email: formData.get("email") as string,
 *       firstName: formData.get("firstName") as string
 *     })
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="firstName" placeholder="First Name" required />
 *       <input name="email" type="email" placeholder="Email" required />
 *       <button type="submit" disabled={isLoading}>
 *         {isLoading ? "Booking..." : "Book Appointment"}
 *       </button>
 *       {error && <p className="error">{error.message}</p>}
 *     </form>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using mutateAsync for sequential bookings
 * const { mutateAsync: bookAppointment } = useGHLBookAppointment()
 *
 * async function bookMultipleAppointments(appointments: BookAppointmentInput[]) {
 *   for (const appointment of appointments) {
 *     try {
 *       const result = await bookAppointment(appointment)
 *       console.log("Booked appointment:", result)
 *     } catch (error) {
 *       console.error("Failed to book appointment:", error)
 *     }
 *   }
 * }
 * ```
 */
export function useGHLBookAppointment() {
  return useGHLMutation(
    (client, data: BookAppointmentInput) => {
      // contactId is required by the SDK
      if (!data.contactId) {
        return Promise.reject(new Error("contactId is required to book an appointment"))
      }
      return client.calendars.createAppointment({
        calendarId: data.calendarId,
        locationId: data.locationId,
        contactId: data.contactId,
        startTime: data.startTime,
        endTime: data.endTime,
        title: data.title,
        appointmentStatus: data.status,
        description: data.description,
      })
    },
    {
      onSuccess: (data) => {
        console.log("Appointment booked successfully:", data)
        // In the future, replace with: toast.success("Appointment booked successfully")
      },
      onError: (error) => {
        console.error("Failed to book appointment:", error.message)
        // In the future, replace with: toast.error(`Failed to book appointment: ${error.message}`)
      },
      invalidateQueries: [["appointments"], ["availability"]], // Invalidate appointment and availability queries
    }
  )
}
