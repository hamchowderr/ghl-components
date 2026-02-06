"use client"

import { useContext } from "react"
import { GHLContext } from "@/registry/new-york/auth/ghl-provider"
import type { HighLevel } from "@gohighlevel/api-client"

interface UseGHLReturn {
  client: HighLevel | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

/**
 * Hook to access the GoHighLevel SDK client from context.
 *
 * @throws {Error} If used outside of GHLProvider
 * @returns {UseGHLReturn} The GHL client instance and authentication state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client, isAuthenticated, isLoading } = useGHL()
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (!isAuthenticated) return <div>Please authenticate</div>
 *
 *   // Use client to make API calls
 *   const contacts = await client.contacts.search(locationId, { query: "test" })
 * }
 * ```
 */
export function useGHL(): UseGHLReturn {
  const context = useContext(GHLContext)

  if (context === undefined) {
    throw new Error(
      "useGHL must be used within a GHLProvider. " +
        "Wrap your component tree with <GHLProvider> to use this hook."
    )
  }

  return context
}
