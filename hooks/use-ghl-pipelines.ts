"use client"

import { useGHLQuery } from "./use-ghl-query"

/**
 * Parameters for listing pipelines
 */
export interface UseGHLPipelinesParams {
  /**
   * The location ID to fetch pipelines from
   */
  locationId: string
}

/**
 * Hook to list all pipelines from a GoHighLevel location.
 * Wraps the `client.opportunities.getPipelines(params)` SDK method.
 *
 * @param params - Parameters including locationId
 * @returns Query result with pipelines array, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function PipelinesList() {
 *   const { data, pipelines, isLoading, error, refetch } = useGHLPipelines({
 *     locationId: "abc123"
 *   })
 *
 *   if (isLoading) return <div>Loading pipelines...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <div>
 *       <button onClick={() => refetch()}>Refresh</button>
 *       {pipelines.map(pipeline => (
 *         <div key={pipeline.id}>{pipeline.name}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With auto-refetch every 60 seconds
 * const { pipelines } = useGHLPipelines(
 *   { locationId: "abc123" },
 *   { refetchInterval: 60000 }
 * )
 * ```
 */
export function useGHLPipelines(
  params: UseGHLPipelinesParams,
  options?: { refetchInterval?: number; enabled?: boolean }
) {
  const result = useGHLQuery(
    ["pipelines", params.locationId],
    (client) => client.opportunities.getPipelines(params),
    {
      enabled: !!params.locationId && (options?.enabled ?? true),
      ...options,
    }
  )

  // Extract pipelines from the result
  const pipelines = (result.data as { pipelines?: unknown[] } | null)?.pipelines || []

  return {
    ...result,
    pipelines,
  }
}
