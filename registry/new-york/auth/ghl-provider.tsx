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
  clientSecret?: string
  redirectUri?: string
  logLevel?: "debug" | "info" | "warn" | "error"
}

export function GHLProvider({
  children,
  clientId,
  clientSecret,
  redirectUri,
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

        // Get credentials from props or environment variables
        const finalClientId =
          clientId || process.env.NEXT_PUBLIC_GHL_CLIENT_ID
        const finalClientSecret =
          clientSecret || process.env.GHL_CLIENT_SECRET
        const finalRedirectUri =
          redirectUri || process.env.NEXT_PUBLIC_GHL_REDIRECT_URI

        if (!finalClientId || !finalClientSecret) {
          throw new Error(
            "GHL_CLIENT_ID and GHL_CLIENT_SECRET must be provided via props or environment variables"
          )
        }

        // Initialize HighLevel client with MemorySessionStorage
        const ghlClient = new HighLevel({
          clientId: finalClientId,
          clientSecret: finalClientSecret,
          redirectUri: finalRedirectUri,
          sessionStorage: new MemorySessionStorage(),
          logLevel,
        })

        setClient(ghlClient)

        // Check if there's an existing session
        // Note: With MemorySessionStorage, sessions are lost on page refresh
        // Upgrade to MongoDBSessionStorage for persistent sessions
        try {
          const session = await ghlClient.oauth.getSession()
          setIsAuthenticated(!!session)
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
  }, [clientId, clientSecret, redirectUri, logLevel])

  const value: GHLContextValue = {
    client,
    isAuthenticated,
    isLoading,
    error,
  }

  return <GHLContext.Provider value={value}>{children}</GHLContext.Provider>
}
