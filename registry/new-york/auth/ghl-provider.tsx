"use client"

import React, { createContext, useEffect, useState, type ReactNode } from "react"
import { HighLevel, MemorySessionStorage } from "@gohighlevel/api-client"

interface GHLContextValue {
  client: HighLevel | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const GHLContext = createContext<GHLContextValue | undefined>(undefined)

interface GHLProviderProps {
  children: ReactNode
  clientId?: string
  logLevel?: "debug" | "info" | "warn" | "error"
}

/**
 * GHL Provider - Context provider for GoHighLevel authentication.
 *
 * SECURITY: This is a client component. Only `clientId` (a public value) should
 * be passed as a prop. The `clientSecret` is read from the server-side environment
 * variable `GHL_CLIENT_SECRET` and is NOT exposed to the browser.
 *
 * For token exchange and refresh, use server-side API routes.
 */
export function GHLProvider({
  children,
  clientId,
  logLevel = "info",
}: GHLProviderProps) {
  const [client, setClient] = useState<HighLevel | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeClient = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const finalClientId =
          clientId || process.env.NEXT_PUBLIC_GHL_CLIENT_ID

        if (!finalClientId) {
          throw new Error(
            "GHL Client ID must be provided via the clientId prop or the NEXT_PUBLIC_GHL_CLIENT_ID environment variable"
          )
        }

        // Initialize HighLevel client with MemorySessionStorage
        // Note: The GHL SDK handles client secret internally via server-side
        // environment. Token exchange should happen in API routes, not client-side.
        const ghlClient = new HighLevel({
          clientId: finalClientId,
          clientSecret: process.env.GHL_CLIENT_SECRET ?? "",
          sessionStorage: new MemorySessionStorage(),
          logLevel,
        })

        setClient(ghlClient)

        // Check if there's an existing auth token
        // Note: With MemorySessionStorage, sessions are lost on page refresh
        // Upgrade to MongoDBSessionStorage for persistent sessions
        try {
          const token = await ghlClient.getAuthToken()
          setIsAuthenticated(!!token)
        } catch {
          setIsAuthenticated(false)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize GHL client")
        console.error("GHL Provider initialization error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    initializeClient()
  }, [clientId, logLevel])

  const value: GHLContextValue = {
    client,
    isAuthenticated,
    isLoading,
    error,
  }

  return <GHLContext.Provider value={value}>{children}</GHLContext.Provider>
}
