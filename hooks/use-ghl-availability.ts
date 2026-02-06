"use client"

import { useGHLQuery } from "./use-ghl-query"

/**
 * Parameters for fetching available time slots
 */
export interface UseGHLAvailabilityParams {
  /**
   * The calendar ID to check availability for
   */
  calendarId: string
  /**
   * The date to check availability (ISO 8601 format or YYYY-MM-DD)
   * @example "2024-01-15" or "2024-01-15T00:00:00Z"
   */
  startDate: string
  /**
   * Optional end date for multi-day availability check
   * @example "2024-01-20"
   */
  endDate?: string
  /**
   * Optional timezone for the slots
   * @example "America/New_York"
   */
  timezone?: string
}

/**
 * Hook to fetch available time slots for a calendar from GoHighLevel.
 * Wraps the `client.calendars.getFreeSlots(params)` SDK method.
 *
 * @param params - Parameters including calendarId, date, and optional timezone
 * @returns Query result with available slots array, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function AvailableSlots() {
 *   const { data: slots, isLoading, error, refetch } = useGHLAvailability({
 *     calendarId: "cal_123",
 *     startDate: "2024-01-15",
 *     timezone: "America/New_York"
 *   })
 *
 *   if (isLoading) return <div>Loading available slots...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <div>
 *       <h2>Available Time Slots</h2>
 *       <button onClick={() => refetch()}>Refresh</button>
 *       {slots?.slots?.map((slot, index) => (
 *         <button key={index}>
 *           {new Date(slot.startTime).toLocaleTimeString()} -
 *           {new Date(slot.endTime).toLocaleTimeString()}
 *         </button>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With auto-refetch every 60 seconds for real-time availability
 * const { data } = useGHLAvailability(
 *   { calendarId: "cal_123", startDate: "2024-01-15" },
 *   { refetchInterval: 60000 }
 * )
 * ```
 */
export function useGHLAvailability(
  params: UseGHLAvailabilityParams,
  options?: { refetchInterval?: number }
) {
  return useGHLQuery(
    [
      "availability",
      params.calendarId,
      params.startDate,
      params.endDate,
      params.timezone,
    ],
    (client) => client.calendars.getFreeSlots(params),
    {
      enabled: !!(params.calendarId && params.startDate),
      ...options,
    }
  )
}
