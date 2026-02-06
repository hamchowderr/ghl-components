"use client"

import { useCallback } from "react"
import { useGHL } from "./use-ghl"

interface UseGHLAuthReturn {
  isAuthenticated: boolean
  isLoading: boolean
  initiateOAuth: (scopes: string[]) => Promise<void>
  handleOAuthCallback: (code: string) => Promise<void>
  logout: () => Promise<void>
}

/**
 * Hook for managing GoHighLevel OAuth authentication flow.
 *
 * @returns {UseGHLAuthReturn} OAuth state and helper methods
 *
 * @example
 * ```tsx
 * function LoginButton() {
 *   const { initiateOAuth, isAuthenticated } = useGHLAuth()
 *
 *   const handleLogin = async () => {
 *     await initiateOAuth([
 *       "contacts.readonly",
 *       "calendars.readonly",
 *       "opportunities.readonly"
 *     ])
 *   }
 *
 *   if (isAuthenticated) return <div>Logged in!</div>
 *
 *   return <button onClick={handleLogin}>Connect to GHL</button>
 * }
 *
 * // In your OAuth callback page:
 * function OAuthCallback() {
 *   const { handleOAuthCallback } = useGHLAuth()
 *   const searchParams = useSearchParams()
 *
 *   useEffect(() => {
 *     const code = searchParams.get('code')
 *     if (code) {
 *       handleOAuthCallback(code)
 *     }
 *   }, [])
 * }
 * ```
 */
export function useGHLAuth(): UseGHLAuthReturn {
  const { client, isAuthenticated, isLoading } = useGHL()

  /**
   * Initiates the OAuth flow by generating an authorization URL and redirecting the user.
   *
   * @param {string[]} scopes - Array of OAuth scopes to request
   * @throws {Error} If client is not initialized
   */
  const initiateOAuth = useCallback(
    async (scopes: string[]) => {
      if (!client) {
        throw new Error("GHL client is not initialized")
      }

      try {
        // Generate the OAuth authorization URL
        const authUrl = client.oauth.generateAuthUrl({
          scopes,
          state: generateRandomState(),
        })

        // Redirect to GHL OAuth page
        window.location.href = authUrl
      } catch (error) {
        console.error("Failed to initiate OAuth:", error)
        throw error
      }
    },
    [client]
  )

  /**
   * Handles the OAuth callback by exchanging the authorization code for tokens.
   *
   * @param {string} code - The authorization code from the OAuth callback
   * @throws {Error} If client is not initialized or token exchange fails
   */
  const handleOAuthCallback = useCallback(
    async (code: string) => {
      if (!client) {
        throw new Error("GHL client is not initialized")
      }

      try {
        // Exchange authorization code for access token
        await client.oauth.getAccessToken(code)

        // The SDK automatically stores the session
        // Force a page reload or state update to reflect authentication
        window.location.href = window.location.origin
      } catch (error) {
        console.error("Failed to handle OAuth callback:", error)
        throw error
      }
    },
    [client]
  )

  /**
   * Logs out the user by clearing the session.
   * Note: With MemorySessionStorage, this just clears in-memory data.
   */
  const logout = useCallback(async () => {
    if (!client) {
      throw new Error("GHL client is not initialized")
    }

    try {
      // Clear the session storage
      await client.oauth.clearSession()

      // Force a page reload to reset state
      window.location.href = window.location.origin
    } catch (error) {
      console.error("Failed to logout:", error)
      throw error
    }
  }, [client])

  return {
    isAuthenticated,
    isLoading,
    initiateOAuth,
    handleOAuthCallback,
    logout,
  }
}

/**
 * Generates a random state parameter for OAuth CSRF protection.
 *
 * @returns {string} A random state string
 */
function generateRandomState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}
