"use client"

import { useGHLQuery } from "./use-ghl-query"

/**
 * Hook to fetch a single calendar by ID from GoHighLevel.
 * Wraps the `client.calendars.getCalendar({ calendarId })` SDK method.
 *
 * @param calendarId - The unique identifier of the calendar to fetch
 * @returns Query result with single calendar object including settings, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function CalendarDetail({ id }: { id: string }) {
 *   const { data: calendar, isLoading, error, refetch } = useGHLCalendar(id)
 *
 *   if (isLoading) return <div>Loading calendar...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *   if (!calendar) return <div>Calendar not found</div>
 *
 *   return (
 *     <div>
 *       <h1>{calendar.name}</h1>
 *       <p>Description: {calendar.description}</p>
 *       <p>Duration: {calendar.slotDuration} minutes</p>
 *       <button onClick={() => refetch()}>Refresh</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Conditionally fetch calendar
 * const calendarId = useParams().id
 * const { data: calendar } = useGHLCalendar(calendarId, {
 *   enabled: !!calendarId // Only fetch if calendarId exists
 * })
 * ```
 */
export function useGHLCalendar(
  calendarId: string | undefined,
  options?: { refetchInterval?: number; enabled?: boolean }
) {
  return useGHLQuery(
    ["calendar", calendarId || ""],
    (client) => client.calendars.getCalendar({ calendarId: calendarId! }),
    {
      enabled: !!calendarId && (options?.enabled ?? true),
      ...options,
    }
  )
}
