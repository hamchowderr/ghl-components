"use client"

import { useGHLMutation } from "./use-ghl-mutation"

/**
 * Input data for canceling an appointment
 */
export interface CancelAppointmentInput {
  /**
   * The event/appointment ID to cancel
   */
  eventId: string
}

/**
 * Hook to cancel an existing appointment in GoHighLevel.
 * Wraps the `client.calendars.deleteEvent({ eventId })` SDK method.
 *
 * Automatically invalidates the `['appointments']` and `['availability']` query cache on success,
 * triggering a refetch of any active appointment and availability queries.
 *
 * @returns Mutation object with mutate function, loading state, error, and data
 *
 * @example
 * ```tsx
 * function AppointmentCard({ appointment }: { appointment: any }) {
 *   const { mutate: cancelAppointment, isLoading, error } = useGHLCancelAppointment()
 *
 *   const handleCancel = () => {
 *     if (confirm("Are you sure you want to cancel this appointment?")) {
 *       cancelAppointment({ eventId: appointment.id })
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       <h3>{appointment.title}</h3>
 *       <p>{new Date(appointment.startTime).toLocaleString()}</p>
 *       <button onClick={handleCancel} disabled={isLoading}>
 *         {isLoading ? "Canceling..." : "Cancel Appointment"}
 *       </button>
 *       {error && <p className="error">{error.message}</p>}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using mutateAsync for sequential cancellations
 * const { mutateAsync: cancelAppointment } = useGHLCancelAppointment()
 *
 * async function cancelMultipleAppointments(eventIds: string[]) {
 *   for (const eventId of eventIds) {
 *     try {
 *       await cancelAppointment({ eventId })
 *       console.log("Canceled appointment:", eventId)
 *     } catch (error) {
 *       console.error("Failed to cancel appointment:", error)
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom callbacks
 * const { mutate: cancelAppointment } = useGHLCancelAppointment()
 *
 * const handleCancelWithRedirect = (eventId: string) => {
 *   cancelAppointment(
 *     { eventId },
 *     {
 *       onSuccess: () => {
 *         router.push("/appointments")
 *       }
 *     }
 *   )
 * }
 * ```
 */
export function useGHLCancelAppointment() {
  return useGHLMutation(
    (client, input: CancelAppointmentInput) =>
      client.calendars.deleteEvent({ eventId: input.eventId }, {}),
    {
      onSuccess: (data) => {
        console.log("Appointment canceled successfully:", data)
        // In the future, replace with: toast.success("Appointment canceled successfully")
      },
      onError: (error) => {
        console.error("Failed to cancel appointment:", error.message)
        // In the future, replace with: toast.error(`Failed to cancel appointment: ${error.message}`)
      },
      invalidateQueries: [["appointments"], ["availability"]], // Invalidate appointment and availability queries
    }
  )
}
