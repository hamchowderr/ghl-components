"use client"

import * as React from "react"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"

import { useGHLPipeline } from "@/hooks/use-ghl-pipeline"
import { useGHLOpportunities } from "@/hooks/use-ghl-opportunities"
import { GHLStageColumn } from "./ghl-stage-column"
import { GHLPipelineSelect } from "./ghl-pipeline-select"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface GHLPipelineBoardProps {
  /**
   * The location ID
   */
  locationId: string
  /**
   * The pipeline ID to display. If not provided, shows pipeline selector.
   */
  pipelineId?: string
  /**
   * Show pipeline selector dropdown
   * @default true when pipelineId is not provided
   */
  showPipelineSelector?: boolean
  /**
   * Contact names mapped by contact ID (for display on cards)
   */
  contactNames?: Record<string, string>
  /**
   * Callback when an opportunity card is clicked
   */
  onOpportunityClick?: (opportunityId: string) => void
  /**
   * Callback when edit is clicked on an opportunity
   */
  onOpportunityEdit?: (opportunityId: string) => void
  /**
   * Callback when delete is clicked on an opportunity
   */
  onOpportunityDelete?: (opportunityId: string) => void
  /**
   * Callback when move stage is clicked on an opportunity
   */
  onOpportunityMoveStage?: (opportunityId: string) => void
  /**
   * Callback when add opportunity button is clicked (receives stage ID)
   */
  onAddOpportunity?: (stageId: string) => void
  /**
   * Auto-refresh interval in milliseconds (0 to disable)
   * @default 0
   */
  refreshInterval?: number
  /**
   * Maximum height for stage columns
   * @default "calc(100vh - 250px)"
   */
  columnMaxHeight?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Full kanban board for GoHighLevel pipeline with draggable columns of opportunities.
 * Combines pipeline stages as columns with opportunity cards.
 *
 * @example
 * ```tsx
 * function SalesPipeline() {
 *   return (
 *     <GHLPipelineBoard
 *       locationId="loc-123"
 *       pipelineId="pipeline-123"
 *       onOpportunityClick={(id) => openDetail(id)}
 *       onAddOpportunity={(stageId) => openCreateForm(stageId)}
 *     />
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With pipeline selector
 * <GHLPipelineBoard
 *   locationId="loc-123"
 *   showPipelineSelector={true}
 *   onOpportunityClick={handleClick}
 * />
 * ```
 */
export function GHLPipelineBoard({
  locationId,
  pipelineId: providedPipelineId,
  showPipelineSelector,
  contactNames = {},
  onOpportunityClick,
  onOpportunityEdit,
  onOpportunityDelete,
  onOpportunityMoveStage,
  onAddOpportunity,
  refreshInterval = 0,
  columnMaxHeight = "calc(100vh - 250px)",
  className,
}: GHLPipelineBoardProps) {
  // Selected pipeline state
  const [selectedPipelineId, setSelectedPipelineId] = React.useState<string>(
    providedPipelineId || ""
  )

  // Update selected pipeline when prop changes
  React.useEffect(() => {
    if (providedPipelineId) {
      setSelectedPipelineId(providedPipelineId)
    }
  }, [providedPipelineId])

  const activePipelineId = providedPipelineId || selectedPipelineId
  const shouldShowSelector = showPipelineSelector ?? !providedPipelineId

  // Fetch pipeline details
  const {
    pipeline,
    isLoading: isPipelineLoading,
    error: pipelineError,
    refetch: refetchPipeline,
  } = useGHLPipeline(activePipelineId, locationId, {
    enabled: !!activePipelineId,
  })

  // Fetch opportunities for the pipeline
  const {
    opportunities,
    isLoading: isOpportunitiesLoading,
    error: opportunitiesError,
    refetch: refetchOpportunities,
  } = useGHLOpportunities(
    {
      locationId,
      pipelineId: activePipelineId,
      limit: 100, // Fetch all opportunities for the board
    },
    {
      enabled: !!activePipelineId,
      refetchInterval: refreshInterval > 0 ? refreshInterval : undefined,
    }
  )

  // Type the opportunities
  const typedOpportunities = opportunities as Array<{
    id: string
    name: string
    pipelineId: string
    pipelineStageId: string
    status: "open" | "won" | "lost" | "abandoned"
    contactId: string
    monetaryValue?: number
    assignedTo?: string
    source?: string
    dateAdded: string
    dateUpdated: string
    [key: string]: unknown
  }>

  // Get sorted stages
  const stages = React.useMemo(() => {
    if (!pipeline?.stages) return []
    return [...pipeline.stages].sort((a, b) => a.position - b.position)
  }, [pipeline?.stages])

  // Group opportunities by stage
  const opportunitiesByStage = React.useMemo(() => {
    const grouped: Record<string, typeof typedOpportunities> = {}
    stages.forEach((stage) => {
      grouped[stage.id] = []
    })
    typedOpportunities.forEach((opp) => {
      if (grouped[opp.pipelineStageId]) {
        grouped[opp.pipelineStageId].push(opp)
      }
    })
    return grouped
  }, [stages, typedOpportunities])

  // Handle refresh
  const handleRefresh = React.useCallback(() => {
    refetchPipeline()
    refetchOpportunities()
  }, [refetchPipeline, refetchOpportunities])

  const isLoading = isPipelineLoading || isOpportunitiesLoading
  const error = pipelineError || opportunitiesError

  // No pipeline selected state
  if (!activePipelineId) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {shouldShowSelector && (
          <div className="flex items-center gap-4">
            <GHLPipelineSelect
              locationId={locationId}
              value={selectedPipelineId}
              onValueChange={setSelectedPipelineId}
              placeholder="Select a pipeline to view..."
              className="max-w-xs"
            />
          </div>
        )}
        <Alert>
          <AlertTitle>No pipeline selected</AlertTitle>
          <AlertDescription>
            Select a pipeline to view its opportunities board.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Loading state
  if (isLoading && stages.length === 0) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {shouldShowSelector && (
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-64" />
          </div>
        )}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-muted/50 rounded-lg border min-w-[300px] w-[300px]"
            >
              <div className="p-3 border-b">
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="p-2 space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="rounded-lg border bg-background p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-2 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {shouldShowSelector && (
          <div className="flex items-center gap-4">
            <GHLPipelineSelect
              locationId={locationId}
              value={selectedPipelineId}
              onValueChange={setSelectedPipelineId}
              className="max-w-xs"
            />
          </div>
        )}
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading pipeline</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load pipeline data. Please try again."}
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={handleRefresh} className="w-fit">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Header with pipeline selector and refresh */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {shouldShowSelector && (
            <GHLPipelineSelect
              locationId={locationId}
              value={selectedPipelineId}
              onValueChange={setSelectedPipelineId}
              className="max-w-xs"
            />
          )}
          {pipeline && !shouldShowSelector && (
            <h2 className="text-lg font-semibold">{pipeline.name}</h2>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Pipeline board */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {stages.map((stage) => (
            <GHLStageColumn
              key={stage.id}
              stage={stage}
              locationId={locationId}
              opportunities={opportunitiesByStage[stage.id] || []}
              contactNames={contactNames}
              isLoading={isOpportunitiesLoading}
              onOpportunityClick={onOpportunityClick}
              onOpportunityEdit={onOpportunityEdit}
              onOpportunityDelete={onOpportunityDelete}
              onOpportunityMoveStage={onOpportunityMoveStage}
              onAddOpportunity={onAddOpportunity}
              maxHeight={columnMaxHeight}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
