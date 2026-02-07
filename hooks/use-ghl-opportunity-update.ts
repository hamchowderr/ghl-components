"use client"

import { useGHLMutation } from "./use-ghl-mutation"

/**
 * Input data for updating an existing opportunity
 */
export interface UpdateOpportunityInput {
  /**
   * The unique identifier of the opportunity to update
   */
  id: string
  /**
   * The name/title of the opportunity
   */
  name?: string
  /**
   * The pipeline stage ID to move the opportunity to
   */
  pipelineStageId?: string
  /**
   * Status of the opportunity
   */
  status?: "open" | "won" | "lost" | "abandoned"
  /**
   * Monetary value of the opportunity
   */
  monetaryValue?: number
  /**
   * User ID of the assigned team member
   */
  assignedTo?: string
  /**
   * Custom field values
   */
  customFields?: Array<{ id: string; value: unknown }>
}

/**
 * Hook to update an existing opportunity in GoHighLevel.
 * Wraps the `client.opportunities.updateOpportunity({ id, data })` SDK method.
 *
 * Automatically invalidates the specific opportunity query cache and all opportunity list queries on success,
 * triggering a refetch of any active queries.
 *
 * @returns Mutation object with mutate function, loading state, error, and data
 *
 * @example
 * ```tsx
 * function EditOpportunityForm({ opportunityId }: { opportunityId: string }) {
 *   const { opportunity } = useGHLOpportunity(opportunityId)
 *   const { mutate: updateOpportunity, isLoading, error } = useGHLOpportunityUpdate()
 *
 *   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 *     e.preventDefault()
 *     const formData = new FormData(e.currentTarget)
 *
 *     updateOpportunity({
 *       id: opportunityId,
 *       name: formData.get("name") as string,
 *       monetaryValue: Number(formData.get("value")),
 *       status: formData.get("status") as "open" | "won" | "lost" | "abandoned",
 *     })
 *   }
 *
 *   if (!opportunity) return <div>Loading...</div>
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="name" defaultValue={opportunity.name} />
 *       <input name="value" type="number" defaultValue={opportunity.monetaryValue} />
 *       <select name="status" defaultValue={opportunity.status}>
 *         <option value="open">Open</option>
 *         <option value="won">Won</option>
 *         <option value="lost">Lost</option>
 *         <option value="abandoned">Abandoned</option>
 *       </select>
 *       <button type="submit" disabled={isLoading}>
 *         {isLoading ? "Updating..." : "Update Opportunity"}
 *       </button>
 *       {error && <p className="error">{error.message}</p>}
 *     </form>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Quick update to mark as won
 * const { mutate: updateOpportunity } = useGHLOpportunityUpdate()
 *
 * function markAsWon(opportunityId: string) {
 *   updateOpportunity({
 *     id: opportunityId,
 *     status: "won"
 *   })
 * }
 * ```
 */
export function useGHLOpportunityUpdate() {
  return useGHLMutation(
    (client, { id, ...data }: UpdateOpportunityInput) =>
      client.opportunities.updateOpportunity({ id }, data),
    {
      onSuccess: (data) => {
        console.log("Opportunity updated successfully:", data)
      },
      onError: (error) => {
        console.error("Failed to update opportunity:", error.message)
      },
      invalidateQueries: [
        ["opportunities"], // Invalidate all opportunity list queries
        ["opportunity"], // Invalidate all individual opportunity queries
      ],
    }
  )
}
