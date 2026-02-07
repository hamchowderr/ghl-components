"use client"

import { useGHLMutation } from "./use-ghl-mutation"

/**
 * Input data for creating a new opportunity
 */
export interface CreateOpportunityInput {
  /**
   * The location ID where the opportunity will be created
   */
  locationId: string
  /**
   * The pipeline ID to add the opportunity to
   */
  pipelineId: string
  /**
   * The pipeline stage ID to place the opportunity in
   */
  pipelineStageId: string
  /**
   * The contact ID associated with this opportunity
   */
  contactId: string
  /**
   * The name/title of the opportunity
   */
  name: string
  /**
   * Status of the opportunity
   * @default "open"
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
   * Source of the opportunity (e.g., "website", "referral")
   */
  source?: string
  /**
   * Custom field values as an array of objects with id and value
   */
  customFields?: Array<{ id: string; value: unknown }>
}

/**
 * Hook to create a new opportunity in GoHighLevel.
 * Wraps the `client.opportunities.createOpportunity(data)` SDK method.
 *
 * Automatically invalidates the `['opportunities']` query cache on success,
 * triggering a refetch of any active opportunity list queries.
 *
 * @returns Mutation object with mutate function, loading state, error, and data
 *
 * @example
 * ```tsx
 * function CreateOpportunityForm() {
 *   const { mutate: createOpportunity, isLoading, error } = useGHLOpportunityCreate()
 *
 *   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 *     e.preventDefault()
 *     const formData = new FormData(e.currentTarget)
 *
 *     createOpportunity({
 *       locationId: "abc123",
 *       pipelineId: "pipeline-id",
 *       pipelineStageId: "stage-id",
 *       contactId: "contact-id",
 *       name: formData.get("name") as string,
 *       monetaryValue: Number(formData.get("value")),
 *       status: "open"
 *     })
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="name" placeholder="Opportunity Name" required />
 *       <input name="value" type="number" placeholder="Value" />
 *       <button type="submit" disabled={isLoading}>
 *         {isLoading ? "Creating..." : "Create Opportunity"}
 *       </button>
 *       {error && <p className="error">{error.message}</p>}
 *     </form>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using mutateAsync for sequential operations
 * const { mutateAsync: createOpportunity } = useGHLOpportunityCreate()
 *
 * async function importOpportunities(opportunities: CreateOpportunityInput[]) {
 *   for (const opp of opportunities) {
 *     try {
 *       const result = await createOpportunity(opp)
 *       console.log("Created opportunity:", result)
 *     } catch (error) {
 *       console.error("Failed to create opportunity:", error)
 *     }
 *   }
 * }
 * ```
 */
export function useGHLOpportunityCreate() {
  return useGHLMutation(
    (client, data: CreateOpportunityInput) => client.opportunities.createOpportunity({
      ...data,
      status: data.status || "open",
    }),
    {
      onSuccess: (data) => {
        console.log("Opportunity created successfully:", data)
      },
      onError: (error) => {
        console.error("Failed to create opportunity:", error.message)
      },
      invalidateQueries: [["opportunities"], ["pipelines"]], // Invalidate opportunity and pipeline queries
    }
  )
}
