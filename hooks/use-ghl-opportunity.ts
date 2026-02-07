"use client"

import { useGHLQuery } from "./use-ghl-query"

/**
 * Hook to fetch a single opportunity by ID from GoHighLevel.
 * Wraps the `client.opportunities.getOpportunity({ id })` SDK method.
 *
 * @param opportunityId - The unique identifier of the opportunity to fetch
 * @param options - Optional configuration for refetch interval and enabled state
 * @returns Query result with single opportunity object, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function OpportunityDetail({ id }: { id: string }) {
 *   const { opportunity, isLoading, error, refetch } = useGHLOpportunity(id)
 *
 *   if (isLoading) return <div>Loading opportunity...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *   if (!opportunity) return <div>Opportunity not found</div>
 *
 *   return (
 *     <div>
 *       <h1>{opportunity.name}</h1>
 *       <p>Value: ${opportunity.monetaryValue}</p>
 *       <p>Status: {opportunity.status}</p>
 *       <button onClick={() => refetch()}>Refresh</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Conditionally fetch opportunity
 * const opportunityId = useParams().id
 * const { opportunity } = useGHLOpportunity(opportunityId, {
 *   enabled: !!opportunityId // Only fetch if opportunityId exists
 * })
 * ```
 */
export function useGHLOpportunity(
  opportunityId: string | undefined,
  options?: { refetchInterval?: number; enabled?: boolean }
) {
  const result = useGHLQuery(
    ["opportunity", opportunityId ?? ""],
    (client) => client.opportunities.getOpportunity({ id: opportunityId! }),
    {
      enabled: !!opportunityId && (options?.enabled ?? true),
      ...options,
    }
  )

  // Extract opportunity from the result
  const opportunity = (result.data as { opportunity?: unknown } | null)?.opportunity || result.data

  return {
    ...result,
    opportunity: opportunity as {
      id: string
      locationId: string
      name: string
      pipelineId: string
      pipelineStageId: string
      status: "open" | "won" | "lost" | "abandoned"
      contactId: string
      monetaryValue?: number
      assignedTo?: string
      source?: string
      customFields?: Array<{ id: string; key: string; value: unknown }>
      followers?: string[]
      dateAdded: string
      dateUpdated: string
      lastStatusChangeAt?: string
      lastStageChangeAt?: string
      lastActivityAt?: string
      lostReasonId?: string
    } | null,
  }
}
