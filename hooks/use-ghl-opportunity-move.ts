"use client"

import { useGHLMutation } from "./use-ghl-mutation"

/**
 * Input data for moving an opportunity between stages
 */
export interface MoveOpportunityInput {
  /**
   * The unique identifier of the opportunity to move
   */
  id: string
  /**
   * The target pipeline stage ID to move the opportunity to
   */
  pipelineStageId: string
}

/**
 * Hook to move an opportunity between pipeline stages in GoHighLevel.
 * This is a specialized mutation for stage changes, optimized for drag-and-drop
 * and quick stage updates.
 *
 * Automatically invalidates the opportunity and pipeline query caches on success.
 *
 * @returns Mutation object with mutate function, loading state, error, and data
 *
 * @example
 * ```tsx
 * function OpportunityStageSelector({ opportunityId, currentStageId }: Props) {
 *   const { mutate: moveOpportunity, isLoading } = useGHLOpportunityMove()
 *
 *   const handleStageChange = (newStageId: string) => {
 *     moveOpportunity({
 *       id: opportunityId,
 *       pipelineStageId: newStageId
 *     })
 *   }
 *
 *   return (
 *     <select
 *       value={currentStageId}
 *       onChange={(e) => handleStageChange(e.target.value)}
 *       disabled={isLoading}
 *     >
 *       {stages.map(stage => (
 *         <option key={stage.id} value={stage.id}>{stage.name}</option>
 *       ))}
 *     </select>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Drag and drop handler
 * const { mutate: moveOpportunity } = useGHLOpportunityMove()
 *
 * function handleDragEnd(result: DropResult) {
 *   if (!result.destination) return
 *
 *   const opportunityId = result.draggableId
 *   const newStageId = result.destination.droppableId
 *
 *   moveOpportunity({
 *     id: opportunityId,
 *     pipelineStageId: newStageId
 *   })
 * }
 * ```
 */
export function useGHLOpportunityMove() {
  return useGHLMutation(
    (client, { id, pipelineStageId }: MoveOpportunityInput) =>
      client.opportunities.updateOpportunity({ id }, { pipelineStageId }),
    {
      onSuccess: (data, variables) => {
        console.log(`Opportunity ${variables.id} moved to stage ${variables.pipelineStageId}`)
      },
      onError: (error, variables) => {
        console.error(`Failed to move opportunity ${variables.id}:`, error.message)
      },
      invalidateQueries: [
        ["opportunities"], // Invalidate all opportunity list queries
        ["opportunity"], // Invalidate all individual opportunity queries
        ["pipelines"], // Invalidate pipeline queries (may show counts per stage)
      ],
    }
  )
}
