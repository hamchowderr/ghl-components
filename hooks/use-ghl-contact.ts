"use client"

import { useGHLQuery } from "./use-ghl-query"

/**
 * Hook to fetch a single contact by ID from GoHighLevel.
 * Wraps the `client.contacts.getContact({ contactId })` SDK method.
 *
 * @param contactId - The unique identifier of the contact to fetch
 * @returns Query result with single contact object, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function ContactDetail({ id }: { id: string }) {
 *   const { data: contact, isLoading, error, refetch } = useGHLContact(id)
 *
 *   if (isLoading) return <div>Loading contact...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *   if (!contact) return <div>Contact not found</div>
 *
 *   return (
 *     <div>
 *       <h1>{contact.firstName} {contact.lastName}</h1>
 *       <p>Email: {contact.email}</p>
 *       <p>Phone: {contact.phone}</p>
 *       <button onClick={() => refetch()}>Refresh</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Conditionally fetch contact
 * const contactId = useParams().id
 * const { data: contact } = useGHLContact(contactId, {
 *   enabled: !!contactId // Only fetch if contactId exists
 * })
 * ```
 */
export function useGHLContact(
  contactId: string | undefined,
  options?: { refetchInterval?: number; enabled?: boolean }
) {
  const result = useGHLQuery(
    ["contact", contactId ?? ""],
    (client) => client.contacts.getContact({ contactId: contactId! }),
    {
      enabled: !!contactId && (options?.enabled ?? true),
      ...options,
    }
  )

  return {
    ...result,
    contact: result.data,
  }
}
