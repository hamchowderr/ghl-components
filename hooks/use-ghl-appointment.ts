"use client"

import { useGHLQuery } from "./use-ghl-query"

/**
 * Hook to fetch a single appointment by ID from GoHighLevel.
 * Note: The GHL API doesn't have a direct getEvent endpoint, so this hook
 * is a placeholder for when/if that functionality becomes available.
 * For now, use useGHLAppointments with filters to get specific appointments.
 *
 * @param appointmentId - The unique identifier of the appointment to fetch
 * @returns Query result with single appointment object, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function AppointmentDetail({ id }: { id: string }) {
 *   const { data: appointment, isLoading, error, refetch } = useGHLAppointment(id)
 *
 *   if (isLoading) return <div>Loading appointment...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *   if (!appointment) return <div>Appointment not found</div>
 *
 *   return (
 *     <div>
 *       <h1>{appointment.title}</h1>
 *       <p>Status: {appointment.appointmentStatus}</p>
 *       <button onClick={() => refetch()}>Refresh</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useGHLAppointment(
  appointmentId: string | undefined,
  options?: { refetchInterval?: number; enabled?: boolean }
) {
  return useGHLQuery(
    ["appointment", appointmentId || ""],
    // Placeholder function - API doesn't support getting single event by ID
    // You'll need to filter the results from getCalendarEvents instead
    async () => {
      // Return null since we can't fetch a single appointment directly
      // In a real implementation, you'd need to know the locationId and date range
      // to filter events by ID from getCalendarEvents
      return null
    },
    {
      enabled: false, // Disabled since API doesn't support this operation
      ...options,
    }
  )
}
