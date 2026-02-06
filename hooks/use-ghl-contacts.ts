"use client"

import { useGHLQuery } from "./use-ghl-query"

/**
 * Parameters for searching/listing contacts
 */
export interface UseGHLContactsParams {
  /**
   * The location ID to search contacts in
   */
  locationId: string
  /**
   * Search query to filter contacts by name, email, phone, etc.
   */
  query?: string
  /**
   * Maximum number of contacts to return per page
   * @default 25
   */
  limit?: number
  /**
   * Number of contacts to skip (for pagination)
   * @default 0
   */
  offset?: number
}

/**
 * Hook to search and list contacts from a GoHighLevel location.
 * Wraps the `client.contacts.searchContactsAdvanced()` SDK method.
 *
 * @param params - Search parameters including locationId, query, limit, and offset
 * @returns Query result with contacts array, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function ContactsList() {
 *   const { data: contacts, isLoading, error, refetch } = useGHLContacts({
 *     locationId: "abc123",
 *     query: "John",
 *     limit: 50,
 *     offset: 0
 *   })
 *
 *   if (isLoading) return <div>Loading contacts...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <div>
 *       <button onClick={() => refetch()}>Refresh</button>
 *       {contacts?.contacts.map(contact => (
 *         <div key={contact.id}>{contact.firstName} {contact.lastName}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With auto-refetch every 30 seconds
 * const { data } = useGHLContacts(
 *   { locationId: "abc123" },
 *   { refetchInterval: 30000 }
 * )
 * ```
 */
export function useGHLContacts(
  params: UseGHLContactsParams,
  options?: { refetchInterval?: number }
) {
  return useGHLQuery(
    ["contacts", params.locationId, params.query, params.limit, params.offset],
    (client) => client.contacts.searchContactsAdvanced(params),
    {
      enabled: !!params.locationId,
      ...options,
    }
  )
}
