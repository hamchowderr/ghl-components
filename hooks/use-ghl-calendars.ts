"use client"

import { useGHLQuery } from "./use-ghl-query"

/**
 * Parameters for listing calendars
 */
export interface UseGHLCalendarsParams {
  /**
   * The location ID to fetch calendars from
   */
  locationId: string
  /**
   * Maximum number of calendars to return
   * @default 25
   */
  limit?: number
  /**
   * Number of calendars to skip (for pagination)
   * @default 0
   */
  skip?: number
}

/**
 * Hook to list all calendars from a GoHighLevel location.
 * Wraps the `client.calendars.getCalendars(params)` SDK method.
 *
 * @param params - Parameters including locationId, limit, and skip
 * @returns Query result with calendars array, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function CalendarsList() {
 *   const { data: calendars, isLoading, error, refetch } = useGHLCalendars({
 *     locationId: "abc123"
 *   })
 *
 *   if (isLoading) return <div>Loading calendars...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <div>
 *       <button onClick={() => refetch()}>Refresh</button>
 *       {calendars?.calendars.map(calendar => (
 *         <div key={calendar.id}>{calendar.name}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With auto-refetch every 60 seconds
 * const { data } = useGHLCalendars(
 *   { locationId: "abc123" },
 *   { refetchInterval: 60000 }
 * )
 * ```
 */
export function useGHLCalendars(
  params: UseGHLCalendarsParams,
  options?: { refetchInterval?: number; enabled?: boolean }
) {
  return useGHLQuery(
    ["calendars", params.locationId, String(params.limit || ""), String(params.skip || "")],
    (client) => client.calendars.getCalendars(params),
    {
      enabled: !!params.locationId && (options?.enabled ?? true),
      ...options,
    }
  )
}
