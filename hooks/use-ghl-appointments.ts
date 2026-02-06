"use client"

import { useGHLQuery } from "./use-ghl-query"

/**
 * Parameters for listing appointments/events
 */
export interface UseGHLAppointmentsParams {
  /**
   * The location ID to fetch appointments from
   */
  locationId?: string
  /**
   * The calendar ID to filter appointments
   */
  calendarId?: string
  /**
   * Start date for the date range filter (ISO 8601 format)
   * @example "2024-01-01T00:00:00Z"
   */
  startDate?: string
  /**
   * End date for the date range filter (ISO 8601 format)
   * @example "2024-01-31T23:59:59Z"
   */
  endDate?: string
  /**
   * Maximum number of appointments to return
   * @default 25
   */
  limit?: number
  /**
   * Number of appointments to skip (for pagination)
   * @default 0
   */
  skip?: number
}

/**
 * Hook to list appointments/events in a date range from GoHighLevel.
 * Wraps the `client.calendars.getCalendarEvents(params)` SDK method.
 *
 * @param params - Parameters including locationId, calendarId, date range, limit, and skip
 * @returns Query result with appointments array, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function AppointmentsList() {
 *   const { data: appointments, isLoading, error, refetch } = useGHLAppointments({
 *     calendarId: "cal_123",
 *     startDate: "2024-01-01T00:00:00Z",
 *     endDate: "2024-01-31T23:59:59Z"
 *   })
 *
 *   if (isLoading) return <div>Loading appointments...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <div>
 *       <button onClick={() => refetch()}>Refresh</button>
 *       {appointments?.events?.map(appointment => (
 *         <div key={appointment.id}>
 *           {appointment.title} - {new Date(appointment.startTime).toLocaleString()}
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With auto-refetch every 30 seconds
 * const { data } = useGHLAppointments(
 *   {
 *     calendarId: "cal_123",
 *     startDate: "2024-01-01T00:00:00Z",
 *     endDate: "2024-01-31T23:59:59Z"
 *   },
 *   { refetchInterval: 30000 }
 * )
 * ```
 */
export function useGHLAppointments(
  params: UseGHLAppointmentsParams,
  options?: { refetchInterval?: number; enabled?: boolean }
) {
  return useGHLQuery(
    [
      "appointments",
      params.locationId || "",
      params.calendarId || "",
      params.startDate || "",
      params.endDate || "",
      String(params.limit || ""),
      String(params.skip || ""),
    ],
    (client) => client.calendars.getCalendarEvents({
      locationId: params.locationId!,
      startTime: params.startDate || "",
      endTime: params.endDate || "",
      calendarId: params.calendarId,
    }),
    {
      enabled: !!params.locationId && (options?.enabled ?? true),
      ...options,
    }
  )
}
