"use client"

import { useGHLMutation } from "./use-ghl-mutation"

/**
 * Input data for creating a new contact
 */
export interface CreateContactInput {
  /**
   * The location ID where the contact will be created
   */
  locationId: string
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
   * Tags to assign to the contact
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
   * Additional contact data
   */
  [key: string]: unknown
}

/**
 * Hook to create a new contact in GoHighLevel.
 * Wraps the `client.contacts.createContact(data)` SDK method.
 *
 * Automatically invalidates the `['contacts']` query cache on success,
 * triggering a refetch of any active contact list queries.
 *
 * @returns Mutation object with mutate function, loading state, error, and data
 *
 * @example
 * ```tsx
 * function CreateContactForm() {
 *   const { mutate: createContact, isLoading, error } = useGHLContactCreate()
 *
 *   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 *     e.preventDefault()
 *     const formData = new FormData(e.currentTarget)
 *
 *     createContact({
 *       locationId: "abc123",
 *       firstName: formData.get("firstName") as string,
 *       lastName: formData.get("lastName") as string,
 *       email: formData.get("email") as string,
 *       phone: formData.get("phone") as string,
 *       tags: ["lead", "website"]
 *     })
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="firstName" placeholder="First Name" required />
 *       <input name="lastName" placeholder="Last Name" />
 *       <input name="email" type="email" placeholder="Email" />
 *       <input name="phone" type="tel" placeholder="Phone" />
 *       <button type="submit" disabled={isLoading}>
 *         {isLoading ? "Creating..." : "Create Contact"}
 *       </button>
 *       {error && <p className="error">{error.message}</p>}
 *     </form>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using mutateAsync for sequential operations
 * const { mutateAsync: createContact } = useGHLContactCreate()
 *
 * async function importContacts(contacts: CreateContactInput[]) {
 *   for (const contact of contacts) {
 *     try {
 *       const result = await createContact(contact)
 *       console.log("Created contact:", result)
 *     } catch (error) {
 *       console.error("Failed to create contact:", error)
 *     }
 *   }
 * }
 * ```
 */
export function useGHLContactCreate() {
  return useGHLMutation(
    (client, data: CreateContactInput) => client.contacts.createContact(data),
    {
      onSuccess: (data) => {
        console.log("Contact created successfully:", data)
        // In the future, replace with: toast.success("Contact created successfully")
      },
      onError: (error) => {
        console.error("Failed to create contact:", error.message)
        // In the future, replace with: toast.error(`Failed to create contact: ${error.message}`)
      },
      invalidateQueries: [["contacts"]], // Invalidate all contact queries
    }
  )
}
