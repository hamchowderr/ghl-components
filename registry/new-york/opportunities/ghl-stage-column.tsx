"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { GHLOpportunityCard } from "./ghl-opportunity-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface GHLStageColumnProps {
  /**
   * The stage data
   */
  stage: {
    id: string
    name: string
    position: number
  }
  /**
   * The location ID (for display purposes)
   */
  locationId: string
  /**
   * Opportunities in this stage
   */
  opportunities: Array<{
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
  /**
   * Contact names mapped by contact ID (for display)
   */
  contactNames?: Record<string, string>
  /**
   * Whether opportunities are loading
   */
  isLoading?: boolean
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
   * Callback when add opportunity button is clicked
   */
  onAddOpportunity?: (stageId: string) => void
  /**
   * Maximum height for the column content
   * @default "calc(100vh - 200px)"
   */
  maxHeight?: string
  /**
   * Show total value of opportunities in the column
   * @default true
   */
  showTotalValue?: boolean
  /**
   * Show opportunity count
   * @default true
   */
  showCount?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * A single kanban column containing opportunity cards for a pipeline stage.
 *
 * @example
 * ```tsx
 * <GHLStageColumn
 *   stage={{ id: "stage-1", name: "Qualified", position: 1 }}
 *   locationId="loc-123"
 *   opportunities={stageOpportunities}
 *   onOpportunityClick={(id) => openDetail(id)}
 *   onAddOpportunity={(stageId) => openCreateForm(stageId)}
 * />
 * ```
 */
export function GHLStageColumn({
  stage,
  locationId: _locationId,
  opportunities,
  contactNames = {},
  isLoading = false,
  onOpportunityClick,
  onOpportunityEdit,
  onOpportunityDelete,
  onOpportunityMoveStage,
  onAddOpportunity,
  maxHeight = "calc(100vh - 200px)",
  showTotalValue = true,
  showCount = true,
  className,
}: GHLStageColumnProps) {
  // Calculate total value
  const totalValue = React.useMemo(() => {
    return opportunities.reduce((sum, opp) => sum + (opp.monetaryValue || 0), 0)
  }, [opportunities])

  // Format currency
  const formatCurrency = React.useCallback((value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }, [])

  // Handle add opportunity
  const handleAddOpportunity = React.useCallback(() => {
    onAddOpportunity?.(stage.id)
  }, [onAddOpportunity, stage.id])

  return (
    <div
      className={cn(
        "flex flex-col bg-muted/50 rounded-lg border min-w-[300px] w-[300px]",
        className
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 border-b bg-background/50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{stage.name}</h3>
          {showCount && (
            <Badge variant="secondary" className="text-xs">
              {opportunities.length}
            </Badge>
          )}
        </div>
        {onAddOpportunity && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleAddOpportunity}
            aria-label={`Add opportunity to ${stage.name}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Total Value */}
      {showTotalValue && totalValue > 0 && (
        <div className="px-3 py-2 border-b text-sm text-muted-foreground">
          Total: <span className="font-medium text-foreground">{formatCurrency(totalValue)}</span>
        </div>
      )}

      {/* Opportunities */}
      <ScrollArea style={{ maxHeight }} className="flex-1">
        <div className="p-2 space-y-2">
          {isLoading ? (
            // Loading skeletons
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-background p-3 space-y-2">
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
            </>
          ) : opportunities.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p className="text-sm">No opportunities</p>
              {onAddOpportunity && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={handleAddOpportunity}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add one
                </Button>
              )}
            </div>
          ) : (
            // Opportunity cards
            opportunities.map((opportunity) => (
              <GHLOpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                stageName={stage.name}
                contactName={contactNames[opportunity.contactId]}
                showValue={true}
                showStatus={true}
                onClick={onOpportunityClick}
                onEdit={onOpportunityEdit}
                onDelete={onOpportunityDelete}
                onMoveStage={onOpportunityMoveStage}
                className="bg-background"
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
