"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useGHL } from "./use-ghl"
import type { HighLevel } from "@gohighlevel/api-client"

interface UseGHLQueryOptions<TData> {
  /**
   * Interval in milliseconds to automatically refetch data
   * Set to 0 or undefined to disable auto-refetch
   */
  refetchInterval?: number
  /**
   * Enable the query. If false, the query will not execute
   * @default true
   */
  enabled?: boolean
  /**
   * Callback fired when query succeeds
   */
  onSuccess?: (data: TData) => void
  /**
   * Callback fired when query fails
   */
  onError?: (error: Error) => void
}

export interface UseGHLQueryReturn<TData> {
  data: TData | null
  isLoading: boolean
  isPending: boolean
  error: Error | null
  refetch: () => Promise<void>
}

// Simple cache implementation
const queryCache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TIME = 5 * 60 * 1000 // 5 minutes

/**
 * Generic hook for fetching data from the GoHighLevel API.
 * Provides loading states, error handling, caching, and auto-refetch capabilities.
 *
 * @param queryKey - Unique key for caching (e.g., ['contacts', locationId])
 * @param fetcher - Function that receives the GHL client and returns a promise
 * @param options - Optional configuration for refetch interval, callbacks, etc.
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useGHLQuery(
 *   ['contacts', locationId],
 *   (client) => client.contacts.searchContactsAdvanced({ locationId }),
 *   { refetchInterval: 30000 } // Refetch every 30 seconds
 * )
 *
 * if (isLoading) return <div>Loading...</div>
 * if (error) return <div>Error: {error.message}</div>
 * return <div>Contacts: {data?.contacts.length}</div>
 * ```
 */
export function useGHLQuery<TData>(
  queryKey: string[],
  fetcher: (client: HighLevel) => Promise<TData>,
  options: UseGHLQueryOptions<TData> = {}
): UseGHLQueryReturn<TData> {
  const { client, isAuthenticated, isLoading: isClientLoading } = useGHL()
  const {
    refetchInterval,
    enabled = true,
    onSuccess,
    onError,
  } = options

  const [data, setData] = useState<TData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Create a stable cache key from the query key array
  const cacheKey = queryKey.join(":")

  const fetchData = useCallback(async () => {
    if (!client || !isAuthenticated || !enabled) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Check cache first
      const cached = queryCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
        if (isMountedRef.current) {
          setData(cached.data as TData)
          setIsLoading(false)
        }
        return
      }

      // Fetch fresh data
      const result = await fetcher(client)

      if (isMountedRef.current) {
        setData(result)
        // Update cache
        queryCache.set(cacheKey, { data: result, timestamp: Date.now() })
        onSuccess?.(result)
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      if (isMountedRef.current) {
        setError(errorObj)
        onError?.(errorObj)
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [client, isAuthenticated, enabled, cacheKey, fetcher, onSuccess, onError])

  // Initial fetch and setup refetch interval
  useEffect(() => {
    if (isClientLoading || !enabled) {
      return
    }

    // Initial fetch
    fetchData()

    // Setup interval if specified
    if (refetchInterval && refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData()
      }, refetchInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchData, refetchInterval, isClientLoading, enabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const refetch = useCallback(async () => {
    // Invalidate cache for this query
    queryCache.delete(cacheKey)
    await fetchData()
  }, [cacheKey, fetchData])

  const loading = isClientLoading || isLoading

  return {
    data,
    isLoading: loading,
    isPending: loading,
    error,
    refetch,
  }
}

/**
 * Utility to invalidate cached queries by key pattern
 * Useful for invalidating multiple related queries at once
 *
 * @example
 * ```tsx
 * // Invalidate all contact queries
 * invalidateQueries(['contacts'])
 * ```
 */
export function invalidateQueries(queryKeyPattern: string[]) {
  const pattern = queryKeyPattern.join(":")
  const keysToDelete: string[] = []

  queryCache.forEach((_, key) => {
    if (key.startsWith(pattern)) {
      keysToDelete.push(key)
    }
  })

  keysToDelete.forEach((key) => queryCache.delete(key))
}
