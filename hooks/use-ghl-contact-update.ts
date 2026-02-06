"use client"

import { useGHLMutation } from "./use-ghl-mutation"

/**
 * Input data for updating an existing contact
 */
export interface UpdateContactInput {
  /**
   * The unique identifier of the contact to update
   */
  contactId: string
  /**
   * Contact's first name
   */
  firstName?: string
  /**
   * Contact's last name
   */
  lastName?: string
  /**
   * Contact's email address
   */
  email?: string
  /**
   * Contact's phone number
   */
  phone?: string
  /**
   * Contact's address
   */
  address?: string
  /**
   * Contact's city
   */
  city?: string
  /**
   * Contact's state/province
   */
  state?: string
  /**
   * Contact's postal/zip code
   */
  postalCode?: string
  /**
   * Contact's country
   */
  country?: string
  /**
   * Contact's company name
   */
  companyName?: string
  /**
   * Contact's website
   */
  website?: string
  /**
   * Tags to assign to the contact (replaces existing tags)
   */
  tags?: string[]
  /**
   * Custom field values
   */
  customFields?: Record<string, string | number | boolean>
  /**
   * Contact source
   */
  source?: string
  /**
   * Additional contact data to update
   */
  [key: string]: unknown
}

/**
 * Hook to update an existing contact in GoHighLevel.
 * Wraps the `client.contacts.updateContact({ contactId, data })` SDK method.
 *
 * Automatically invalidates the specific contact query cache and all contact list queries on success,
 * triggering a refetch of any active queries.
 *
 * @returns Mutation object with mutate function, loading state, error, and data
 *
 * @example
 * ```tsx
 * function EditContactForm({ contactId }: { contactId: string }) {
 *   const { data: contact } = useGHLContact(contactId)
 *   const { mutate: updateContact, isLoading, error } = useGHLContactUpdate()
 *
 *   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 *     e.preventDefault()
 *     const formData = new FormData(e.currentTarget)
 *
 *     updateContact({
 *       contactId,
 *       firstName: formData.get("firstName") as string,
 *       lastName: formData.get("lastName") as string,
 *       email: formData.get("email") as string,
 *       phone: formData.get("phone") as string,
 *     })
 *   }
 *
 *   if (!contact) return <div>Loading...</div>
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="firstName" defaultValue={contact.firstName} />
 *       <input name="lastName" defaultValue={contact.lastName} />
 *       <input name="email" defaultValue={contact.email} />
 *       <input name="phone" defaultValue={contact.phone} />
 *       <button type="submit" disabled={isLoading}>
 *         {isLoading ? "Updating..." : "Update Contact"}
 *       </button>
 *       {error && <p className="error">{error.message}</p>}
 *     </form>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Quick update with optimistic UI
 * const { mutate: updateContact } = useGHLContactUpdate()
 *
 * function toggleContactFavorite(contactId: string, isFavorite: boolean) {
 *   updateContact({
 *     contactId,
 *     customFields: {
 *       favorite: !isFavorite
 *     }
 *   })
 * }
 * ```
 */
export function useGHLContactUpdate() {
  return useGHLMutation(
    (client, { contactId, ...data }: UpdateContactInput) =>
      client.contacts.updateContact({ contactId, data }),
    {
      onSuccess: (data, variables) => {
        console.log("Contact updated successfully:", data)
        // In the future, replace with: toast.success("Contact updated successfully")
      },
      onError: (error) => {
        console.error("Failed to update contact:", error.message)
        // In the future, replace with: toast.error(`Failed to update contact: ${error.message}`)
      },
      invalidateQueries: [
        ["contacts"], // Invalidate all contact list queries
        ["contact"], // Invalidate all individual contact queries
      ],
    }
  )
}
