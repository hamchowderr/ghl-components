"use client"

import { useGHLQuery } from "./use-ghl-query"

/**
 * Hook to fetch a single pipeline by ID from GoHighLevel.
 * Returns the pipeline with its stages.
 *
 * @param pipelineId - The unique identifier of the pipeline to fetch
 * @param locationId - The location ID where the pipeline exists
 * @param options - Optional configuration for refetch interval and enabled state
 * @returns Query result with single pipeline object, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function PipelineDetail({ id, locationId }: { id: string; locationId: string }) {
 *   const { pipeline, isLoading, error, refetch } = useGHLPipeline(id, locationId)
 *
 *   if (isLoading) return <div>Loading pipeline...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *   if (!pipeline) return <div>Pipeline not found</div>
 *
 *   return (
 *     <div>
 *       <h1>{pipeline.name}</h1>
 *       <h2>Stages:</h2>
 *       <ul>
 *         {pipeline.stages.map(stage => (
 *           <li key={stage.id}>{stage.name}</li>
 *         ))}
 *       </ul>
 *       <button onClick={() => refetch()}>Refresh</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Conditionally fetch pipeline
 * const pipelineId = useParams().id
 * const { pipeline } = useGHLPipeline(pipelineId, locationId, {
 *   enabled: !!pipelineId // Only fetch if pipelineId exists
 * })
 * ```
 */
export function useGHLPipeline(
  pipelineId: string | undefined,
  locationId: string,
  options?: { refetchInterval?: number; enabled?: boolean }
) {
  const result = useGHLQuery(
    ["pipeline", pipelineId ?? "", locationId],
    async (client) => {
      // The GHL API doesn't have a direct getPipeline method
      // We fetch all pipelines and find the one we need
      const response = await client.opportunities.getPipelines({ locationId })
      const pipelines = (response as { pipelines?: unknown[] })?.pipelines || []
      const pipeline = pipelines.find(
        (p: unknown) => (p as { id: string }).id === pipelineId
      )
      if (!pipeline) {
        throw new Error(`Pipeline with ID ${pipelineId} not found`)
      }
      return pipeline
    },
    {
      enabled: !!pipelineId && !!locationId && (options?.enabled ?? true),
      ...options,
    }
  )

  return {
    ...result,
    pipeline: result.data as {
      id: string
      name: string
      locationId: string
      stages: Array<{
        id: string
        name: string
        position: number
        showInFunnel: boolean
        showInPieChart: boolean
      }>
      showInFunnel: boolean
      showInPieChart: boolean
      dateAdded: string
      dateUpdated: string
    } | null,
  }
}
