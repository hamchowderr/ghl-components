"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { useGHLPipeline } from "@/hooks/use-ghl-pipeline"
import { useGHLOpportunityMove } from "@/hooks/use-ghl-opportunity-move"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface GHLStageSelectorProps {
  /**
   * The opportunity ID to move between stages
   */
  opportunityId: string
  /**
   * The pipeline ID to fetch stages from
   */
  pipelineId: string
  /**
   * The location ID (required to fetch pipeline)
   */
  locationId: string
  /**
   * Currently selected stage ID
   */
  value?: string
  /**
   * Pre-loaded stages (to avoid re-fetching)
   */
  stages?: Array<{
    id: string
    name: string
    position: number
  }>
  /**
   * Callback when stage is changed
   */
  onValueChange?: (stageId: string) => void
  /**
   * Whether to immediately move the opportunity when stage changes
   * @default true
   */
  autoMove?: boolean
  /**
   * Callback when move operation succeeds
   */
  onMoveSuccess?: (stageId: string) => void
  /**
   * Callback when move operation fails
   */
  onMoveError?: (error: Error) => void
  /**
   * Placeholder text when no stage is selected
   */
  placeholder?: string
  /**
   * Whether the selector is disabled
   */
  disabled?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Dropdown selector for moving an opportunity between pipeline stages.
 * Optionally auto-moves the opportunity when a new stage is selected.
 *
 * @example
 * ```tsx
 * function OpportunityStageControl({ opportunity, locationId }: Props) {
 *   return (
 *     <GHLStageSelector
 *       opportunityId={opportunity.id}
 *       pipelineId={opportunity.pipelineId}
 *       locationId={locationId}
 *       value={opportunity.pipelineStageId}
 *       autoMove={true}
 *       onMoveSuccess={(stageId) => console.log('Moved to', stageId)}
 *     />
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With pre-loaded stages (no additional API call)
 * <GHLStageSelector
 *   opportunityId={opportunity.id}
 *   pipelineId={opportunity.pipelineId}
 *   locationId={locationId}
 *   value={opportunity.pipelineStageId}
 *   stages={pipeline.stages}
 *   autoMove={true}
 * />
 * ```
 */
export function GHLStageSelector({
  opportunityId,
  pipelineId,
  locationId,
  value,
  stages: providedStages,
  onValueChange,
  autoMove = true,
  onMoveSuccess,
  onMoveError,
  placeholder = "Select stage...",
  disabled = false,
  className,
}: GHLStageSelectorProps) {
  const [open, setOpen] = React.useState(false)

  // Fetch pipeline stages if not provided
  const { pipeline, isLoading: isPipelineLoading } = useGHLPipeline(
    pipelineId,
    locationId,
    { enabled: !providedStages && !!pipelineId }
  )

  // Move opportunity mutation
  const { mutate: moveOpportunity, isPending: isMoving } = useGHLOpportunityMove()

  // Get stages from props or fetched pipeline
  const stages = React.useMemo(() => {
    if (providedStages) return providedStages
    if (pipeline?.stages) return pipeline.stages
    return []
  }, [providedStages, pipeline?.stages])

  // Sort stages by position
  const sortedStages = React.useMemo(() => {
    return [...stages].sort((a, b) => a.position - b.position)
  }, [stages])

  // Find selected stage
  const selectedStage = React.useMemo(() => {
    return sortedStages.find((s) => s.id === value)
  }, [sortedStages, value])

  // Handle stage selection
  const handleSelect = React.useCallback(
    (stageId: string) => {
      // Don't do anything if selecting the same stage
      if (stageId === value) {
        setOpen(false)
        return
      }

      // Call onValueChange callback
      onValueChange?.(stageId)

      // Auto-move if enabled
      if (autoMove) {
        moveOpportunity(
          { id: opportunityId, pipelineStageId: stageId },
          {
            onSuccess: () => {
              onMoveSuccess?.(stageId)
            },
            onError: (error) => {
              onMoveError?.(error)
            },
          }
        )
      }

      setOpen(false)
    },
    [value, onValueChange, autoMove, opportunityId, moveOpportunity, onMoveSuccess, onMoveError]
  )

  const isLoading = isPipelineLoading || isMoving

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select stage"
          disabled={disabled || isLoading}
          className={cn("w-full justify-between", className)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isMoving ? "Moving..." : "Loading..."}
            </>
          ) : selectedStage ? (
            <span className="truncate">{selectedStage.name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search stages..." />
          <CommandList>
            {sortedStages.length === 0 ? (
              <CommandEmpty>No stages found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {sortedStages.map((stage, index) => (
                  <CommandItem
                    key={stage.id}
                    value={stage.name}
                    onSelect={() => handleSelect(stage.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === stage.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                        {index + 1}
                      </span>
                      <span>{stage.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
