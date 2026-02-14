"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useGHLOpportunities } from "@/hooks/use-ghl-opportunities"
import { GHLPipelineBoard } from "./ghl-pipeline-board"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DollarSign, TrendingUp, Target, BarChart3 } from "lucide-react"

/**
 * Props for the GHLSalesDashboard component
 */
export interface GHLSalesDashboardProps {
  /**
   * The location ID for the dashboard
   */
  locationId: string
  /**
   * Optional pipeline ID to filter by
   */
  pipelineId?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Format a number as USD currency
 */
const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value)

/**
 * Pipeline overview dashboard with stats cards and kanban board
 *
 * Displays key sales metrics (total opportunities, total value,
 * win rate, average deal size) and a full pipeline board below.
 *
 * @example
 * ```tsx
 * <GHLSalesDashboard
 *   locationId="loc_123"
 *   pipelineId="pipeline_456"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Without a pipeline pre-selected (shows pipeline selector in the board)
 * <GHLSalesDashboard locationId="loc_123" />
 * ```
 */
export function GHLSalesDashboard({
  locationId,
  pipelineId,
  className,
}: GHLSalesDashboardProps) {
  const { opportunities, isLoading, error } = useGHLOpportunities(
    {
      locationId,
      pipelineId,
      limit: 200,
    },
    { enabled: !!locationId }
  )

  // Calculate stats from opportunities
  const stats = React.useMemo(() => {
    if (!opportunities || opportunities.length === 0) return null

    const typedOpps = opportunities as Array<{
      monetaryValue?: number
      status?: string
    }>

    const total = typedOpps.length
    const totalValue = typedOpps.reduce(
      (sum, opp) => sum + (opp.monetaryValue || 0),
      0
    )
    const won = typedOpps.filter((o) => o.status === "won").length
    const lost = typedOpps.filter((o) => o.status === "lost").length
    const winRate =
      won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0
    const avgDeal = total > 0 ? totalValue / total : 0

    return { total, totalValue, winRate, avgDeal }
  }, [opportunities])

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatsCard
          title="Total Opportunities"
          value={isLoading ? undefined : String(stats?.total ?? 0)}
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Value"
          value={
            isLoading ? undefined : formatCurrency(stats?.totalValue ?? 0)
          }
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Win Rate"
          value={isLoading ? undefined : `${stats?.winRate ?? 0}%`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Avg Deal Size"
          value={
            isLoading ? undefined : formatCurrency(stats?.avgDeal ?? 0)
          }
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      {/* Error state for stats (board handles its own errors) */}
      {error && !isLoading && (
        <p className="text-sm text-muted-foreground">
          Unable to calculate stats. The pipeline board may still load below.
        </p>
      )}

      {/* Pipeline Board */}
      <GHLPipelineBoard
        locationId={locationId}
        pipelineId={pipelineId}
        showPipelineSelector={!pipelineId}
      />
    </div>
  )
}

/**
 * Individual stats card
 */
function StatsCard({
  title,
  value,
  icon,
  isLoading,
}: {
  title: string
  value?: string
  icon: React.ReactNode
  isLoading: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-24" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}
