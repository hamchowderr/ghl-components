"use client"

import * as React from "react"
import { MoreVertical, DollarSign, User, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react"

import { useGHLOpportunity } from "@/hooks/use-ghl-opportunity"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export interface GHLOpportunityCardProps {
  /**
   * Opportunity ID to fetch (if opportunity prop is not provided)
   */
  opportunityId?: string
  /**
   * Pre-loaded opportunity data
   */
  opportunity?: {
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
  }
  /**
   * Pipeline stage name (for display)
   */
  stageName?: string
  /**
   * Contact name (for display)
   */
  contactName?: string
  /**
   * Show monetary value
   * @default true
   */
  showValue?: boolean
  /**
   * Show status badge
   * @default true
   */
  showStatus?: boolean
  /**
   * Callback when edit is clicked
   */
  onEdit?: (opportunityId: string) => void
  /**
   * Callback when delete is clicked
   */
  onDelete?: (opportunityId: string) => void
  /**
   * Callback when move stage is clicked
   */
  onMoveStage?: (opportunityId: string) => void
  /**
   * Callback when card is clicked
   */
  onClick?: (opportunityId: string) => void
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Display card for a GoHighLevel opportunity with status, value, and stage information.
 *
 * @example
 * ```tsx
 * // With pre-loaded data
 * <GHLOpportunityCard
 *   opportunity={opportunity}
 *   stageName="Qualified"
 *   contactName="John Doe"
 *   onEdit={(id) => console.log('Edit', id)}
 *   onMoveStage={(id) => console.log('Move', id)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Fetching by ID
 * <GHLOpportunityCard
 *   opportunityId="opp-123"
 *   onEdit={handleEdit}
 * />
 * ```
 */
export function GHLOpportunityCard({
  opportunityId,
  opportunity: providedOpportunity,
  stageName,
  contactName,
  showValue = true,
  showStatus = true,
  onEdit,
  onDelete,
  onMoveStage,
  onClick,
  className,
}: GHLOpportunityCardProps) {
  // Fetch opportunity data if only ID is provided
  const { opportunity: fetchedOpportunity, isLoading, error } = useGHLOpportunity(
    opportunityId,
    { enabled: !!opportunityId && !providedOpportunity }
  )

  const opportunity = providedOpportunity || fetchedOpportunity

  // Format currency
  const formatCurrency = React.useCallback((value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }, [])

  // Format date
  const formatDate = React.useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }, [])

  // Get status badge variant and icon
  const getStatusConfig = React.useCallback((status: string) => {
    switch (status) {
      case "won":
        return {
          variant: "default" as const,
          label: "Won",
          icon: TrendingUp,
          className: "bg-green-500 hover:bg-green-500/80",
        }
      case "lost":
        return {
          variant: "destructive" as const,
          label: "Lost",
          icon: TrendingDown,
          className: "",
        }
      case "abandoned":
        return {
          variant: "secondary" as const,
          label: "Abandoned",
          icon: Minus,
          className: "",
        }
      default:
        return {
          variant: "outline" as const,
          label: "Open",
          icon: TrendingUp,
          className: "",
        }
    }
  }, [])

  // Get initials from name
  const getInitials = React.useCallback((name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }, [])

  // Handle actions
  const handleEdit = React.useCallback(() => {
    if (opportunity && onEdit) {
      onEdit(opportunity.id)
    }
  }, [opportunity, onEdit])

  const handleDelete = React.useCallback(() => {
    if (opportunity && onDelete) {
      onDelete(opportunity.id)
    }
  }, [opportunity, onDelete])

  const handleMoveStage = React.useCallback(() => {
    if (opportunity && onMoveStage) {
      onMoveStage(opportunity.id)
    }
  }, [opportunity, onMoveStage])

  const handleClick = React.useCallback(() => {
    if (opportunity && onClick) {
      onClick(opportunity.id)
    }
  }, [opportunity, onClick])

  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-full" />
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTitle>Error loading opportunity</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load opportunity data"}
        </AlertDescription>
      </Alert>
    )
  }

  // No opportunity data
  if (!opportunity) {
    return (
      <Alert className={className}>
        <AlertTitle>No opportunity found</AlertTitle>
        <AlertDescription>
          The requested opportunity could not be found.
        </AlertDescription>
      </Alert>
    )
  }

  const statusConfig = getStatusConfig(opportunity.status)
  const StatusIcon = statusConfig.icon

  return (
    <Card
      className={cn(
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick ? handleClick : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleClick()
              }
            }
          : undefined
      }
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(opportunity.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-base font-medium leading-none">
              {opportunity.name}
            </CardTitle>
            {(contactName || stageName) && (
              <CardDescription className="text-sm">
                {contactName && <span>{contactName}</span>}
                {contactName && stageName && <span> - </span>}
                {stageName && <span>{stageName}</span>}
              </CardDescription>
            )}
          </div>
        </div>
        {(onEdit || onDelete || onMoveStage) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Opportunity actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
              )}
              {onMoveStage && (
                <DropdownMenuItem onClick={handleMoveStage}>
                  Move to Stage
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          {showValue && opportunity.monetaryValue !== undefined && (
            <div className="flex items-center gap-1 text-lg font-semibold">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              {formatCurrency(opportunity.monetaryValue)}
            </div>
          )}
          {showStatus && (
            <Badge
              variant={statusConfig.variant}
              className={cn("gap-1", statusConfig.className)}
            >
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {opportunity.assignedTo && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>Assigned</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(opportunity.dateAdded)}</span>
          </div>
        </div>

        {opportunity.source && (
          <div className="text-xs text-muted-foreground">
            Source: {opportunity.source}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
