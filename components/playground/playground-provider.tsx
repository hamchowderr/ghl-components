"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"

interface PlaygroundContextValue {
  token: string | null
  locationId: string | null
  mode: "demo" | "live"
  isConnected: boolean
  connectionError: string | null
  setCredentials: (token: string, locationId: string) => void
  disconnect: () => void
  setMode: (mode: "demo" | "live") => void
  fetchGHL: <T = unknown>(path: string, params?: Record<string, string>) => Promise<T>
}

const PlaygroundContext = createContext<PlaygroundContextValue | undefined>(undefined)

const SESSION_KEY = "ghl-playground"

export function PlaygroundProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [locationId, setLocationId] = useState<string | null>(null)
  const [mode, setMode] = useState<"demo" | "live">("demo")
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) {
        const { token: t, locationId: l } = JSON.parse(saved)
        if (t && l) {
          setToken(t)
          setLocationId(l)
          setMode("live")
        }
      }
    } catch {
      // Ignore
    }
  }, [])

  const setCredentials = useCallback((newToken: string, newLocationId: string) => {
    setToken(newToken)
    setLocationId(newLocationId)
    setMode("live")
    setConnectionError(null)
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token: newToken, locationId: newLocationId }))
    } catch {
      // Ignore
    }
  }, [])

  const disconnect = useCallback(() => {
    setToken(null)
    setLocationId(null)
    setMode("demo")
    setConnectionError(null)
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // Ignore
    }
  }, [])

  const fetchGHL = useCallback(async <T = unknown>(path: string, params?: Record<string, string>): Promise<T> => {
    if (!token) {
      throw new Error("Not connected")
    }

    const url = new URL(`/api/playground/${path}`, window.location.origin)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }
    if (locationId) {
      url.searchParams.set("locationId", locationId)
    }

    const response = await fetch(url.toString(), {
      headers: { "x-ghl-token": token },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || error.message || `API error ${response.status}`)
    }

    return response.json()
  }, [token, locationId])

  const isConnected = !!token && !!locationId

  return (
    <PlaygroundContext.Provider
      value={{
        token,
        locationId,
        mode,
        isConnected,
        connectionError,
        setCredentials,
        disconnect,
        setMode,
        fetchGHL,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  )
}

export function usePlayground() {
  const context = useContext(PlaygroundContext)
  if (!context) {
    throw new Error("usePlayground must be used within PlaygroundProvider")
  }
  return context
}
