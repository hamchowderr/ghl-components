"use client"

import { useGHLQuery } from "./use-ghl-query"

/**
 * Parameters for searching/listing opportunities
 */
export interface UseGHLOpportunitiesParams {
  /**
   * The location ID to search opportunities in
   */
  locationId: string
  /**
   * Filter by pipeline ID
   */
  pipelineId?: string
  /**
   * Filter by pipeline stage ID
   */
  pipelineStageId?: string
  /**
   * Filter by contact ID
   */
  contactId?: string
  /**
   * Filter by status: open, won, lost, abandoned
   */
  status?: "open" | "won" | "lost" | "abandoned"
  /**
   * Filter by assigned user ID
   */
  assignedTo?: string
  /**
   * Search query to filter opportunities by name
   */
  query?: string
  /**
   * Maximum number of opportunities to return per page
   * @default 25
   */
  limit?: number
  /**
   * Page number for pagination (1-based)
   * @default 1
   */
  page?: number
}

/**
 * Hook to search and list opportunities from a GoHighLevel location.
 * Wraps the `client.opportunities.searchOpportunities(params)` SDK method.
 *
 * @param params - Search parameters including locationId, pipelineId, status, query, limit, and page
 * @returns Query result with opportunities array, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function OpportunitiesList() {
 *   const { opportunities, isLoading, error, refetch, pagination } = useGHLOpportunities({
 *     locationId: "abc123",
 *     pipelineId: "pipeline-id",
 *     status: "open",
 *     limit: 50
 *   })
 *
 *   if (isLoading) return <div>Loading opportunities...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <div>
 *       <button onClick={() => refetch()}>Refresh</button>
 *       {opportunities.map(opp => (
 *         <div key={opp.id}>{opp.name} - ${opp.monetaryValue}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Filter by stage
 * const { opportunities } = useGHLOpportunities({
 *   locationId: "abc123",
 *   pipelineId: "pipeline-id",
 *   pipelineStageId: "stage-id"
 * })
 * ```
 */
export function useGHLOpportunities(
  params: UseGHLOpportunitiesParams,
  options?: { refetchInterval?: number; enabled?: boolean }
) {
  const result = useGHLQuery(
    [
      "opportunities",
      params.locationId,
      params.pipelineId ?? "",
      params.pipelineStageId ?? "",
      params.contactId ?? "",
      params.status ?? "",
      params.assignedTo ?? "",
      params.query ?? "",
      String(params.limit ?? ""),
      String(params.page ?? ""),
    ],
    (client) => client.opportunities.searchOpportunity(params),
    {
      enabled: !!params.locationId && (options?.enabled ?? true),
      ...options,
    }
  )

  // Extract opportunities and pagination from the result
  const opportunities = (result.data as { opportunities?: unknown[] } | null)?.opportunities || []
  const meta = result.data as { meta?: { total?: number; currentPage?: number; nextPage?: number } } | null
  const pagination = meta?.meta ? {
    total: meta.meta.total,
    currentPage: meta.meta.currentPage,
    nextPage: meta.meta.nextPage,
    count: opportunities.length,
  } : undefined

  return {
    ...result,
    opportunities,
    pagination,
  }
}
