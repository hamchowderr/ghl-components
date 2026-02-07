"use client"

import { useState, useCallback } from "react"
import { useGHL } from "./use-ghl"
import { invalidateQueries } from "./use-ghl-query"
import type { HighLevel } from "@gohighlevel/api-client"

interface UseGHLMutationOptions<TData, TVariables> {
  /**
   * Callback fired when mutation succeeds
   */
  onSuccess?: (data: TData, variables: TVariables) => void
  /**
   * Callback fired when mutation fails
   */
  onError?: (error: Error, variables: TVariables) => void
  /**
   * Callback fired after mutation completes (success or error)
   */
  onSettled?: (
    data: TData | null,
    error: Error | null,
    variables: TVariables
  ) => void
  /**
   * Query keys to invalidate after successful mutation
   * This will trigger refetch for any active queries with matching keys
   */
  invalidateQueries?: string[][]
}

export interface UseGHLMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables, options?: { onSuccess?: (data: TData) => void; onError?: (error: Error) => void }) => Promise<void>
  mutateAsync: (variables: TVariables) => Promise<TData>
  data: TData | null
  isLoading: boolean
  isPending: boolean
  error: Error | null
  reset: () => void
}

/**
 * Generic hook for mutations (POST/PUT/DELETE operations) with the GoHighLevel API.
 * Provides loading states, error handling, and query invalidation.
 *
 * @param mutationFn - Function that receives the GHL client and variables, returns a promise
 * @param options - Optional configuration for callbacks and query invalidation
 *
 * @example
 * ```tsx
 * const { mutate, isLoading, error } = useGHLMutation(
 *   (client, input: CreateContactInput) => client.contacts.createContact(input),
 *   {
 *     onSuccess: (data) => {
 *       toast.success('Contact created successfully')
 *       console.log('Created contact:', data)
 *     },
 *     onError: (error) => {
 *       toast.error(`Failed to create contact: ${error.message}`)
 *     },
 *     invalidateQueries: [['contacts']] // Refetch all contact queries
 *   }
 * )
 *
 * // Later in your component
 * <Button
 *   onClick={() => mutate({ locationId: '123', firstName: 'John' })}
 *   disabled={isLoading}
 * >
 *   {isLoading ? 'Creating...' : 'Create Contact'}
 * </Button>
 * ```
 *
 * @example
 * // Using mutateAsync for sequential operations
 * ```tsx
 * const { mutateAsync } = useGHLMutation(
 *   (client, id: string) => client.contacts.deleteContact(id)
 * )
 *
 * async function deleteMultiple(ids: string[]) {
 *   for (const id of ids) {
 *     await mutateAsync(id)
 *   }
 * }
 * ```
 */
export function useGHLMutation<TData, TVariables = void>(
  mutationFn: (client: HighLevel, variables: TVariables) => Promise<TData>,
  options: UseGHLMutationOptions<TData, TVariables> = {}
): UseGHLMutationReturn<TData, TVariables> {
  const { client, isAuthenticated } = useGHL()
  const {
    onSuccess,
    onError,
    onSettled,
    invalidateQueries: invalidateQueriesKeys,
  } = options

  const [data, setData] = useState<TData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      if (!client || !isAuthenticated) {
        throw new Error(
          "Cannot perform mutation: GHL client is not authenticated"
        )
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await mutationFn(client, variables)
        setData(result)

        // Call success callback
        onSuccess?.(result, variables)

        // Invalidate queries if specified
        if (invalidateQueriesKeys && invalidateQueriesKeys.length > 0) {
          invalidateQueriesKeys.forEach((queryKey) => {
            invalidateQueries(queryKey)
          })
        }

        // Call settled callback
        onSettled?.(result, null, variables)

        return result
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err))
        setError(errorObj)

        // Call error callback
        onError?.(errorObj, variables)

        // Call settled callback
        onSettled?.(null, errorObj, variables)

        throw errorObj
      } finally {
        setIsLoading(false)
      }
    },
    [
      client,
      isAuthenticated,
      mutationFn,
      onSuccess,
      onError,
      onSettled,
      invalidateQueriesKeys,
    ]
  )

  const mutate = useCallback(
    async (variables: TVariables, options?: { onSuccess?: (data: TData) => void; onError?: (error: Error) => void }) => {
      try {
        const result = await mutateAsync(variables)
        options?.onSuccess?.(result)
      } catch (err) {
        // Error is already handled in mutateAsync
        // Call onError callback if provided
        if (options?.onError && err instanceof Error) {
          options.onError(err)
        }
      }
    },
    [mutateAsync]
  )

  return {
    mutate,
    mutateAsync,
    data,
    isLoading,
    isPending: isLoading,
    error,
    reset,
  }
}
