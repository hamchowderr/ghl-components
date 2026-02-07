"use client"

import * as React from "react"
import { Search, AlertCircle, Filter } from "lucide-react"

import { useGHLOpportunities } from "@/hooks/use-ghl-opportunities"
import { GHLOpportunityCard } from "./ghl-opportunity-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface GHLOpportunityListProps {
  /**
   * The location ID to fetch opportunities from
   */
  locationId: string
  /**
   * Filter by pipeline ID
   */
  pipelineId?: string
  /**
   * Filter by stage ID
   */
  stageId?: string
  /**
   * Callback when an opportunity is selected
   */
  onSelect?: (opportunity: {
    id: string
    name: string
    pipelineId: string
    pipelineStageId: string
    status: "open" | "won" | "lost" | "abandoned"
    contactId: string
    monetaryValue?: number
    [key: string]: unknown
  }) => void
  /**
   * Currently selected opportunity ID
   */
  selectedId?: string
  /**
   * Stage names mapped by stage ID (for display)
   */
  stageNames?: Record<string, string>
  /**
   * Contact names mapped by contact ID (for display)
   */
  contactNames?: Record<string, string>
  /**
   * Show search input
   * @default true
   */
  showSearch?: boolean
  /**
   * Show status filter
   * @default true
   */
  showStatusFilter?: boolean
  /**
   * Callback when edit is clicked
   */
  onEdit?: (opportunityId: string) => void
  /**
   * Callback when delete is clicked
   */
  onDelete?: (opportunityId: string) => void
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Scrollable list view of GoHighLevel opportunities with search and filtering.
 *
 * @example
 * ```tsx
 * function OpportunitiesPage() {
 *   const [selected, setSelected] = React.useState<string>()
 *
 *   return (
 *     <GHLOpportunityList
 *       locationId="loc-123"
 *       pipelineId="pipeline-123"
 *       onSelect={(opp) => setSelected(opp.id)}
 *       selectedId={selected}
 *       onEdit={(id) => openEditModal(id)}
 *     />
 *   )
 * }
 * ```
 */
export function GHLOpportunityList({
  locationId,
  pipelineId,
  stageId,
  onSelect,
  selectedId,
  stageNames = {},
  contactNames = {},
  showSearch = true,
  showStatusFilter = true,
  onEdit,
  onDelete,
  className,
}: GHLOpportunityListProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const limit = 10

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = React.useState("")

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, pipelineId, stageId])

  // Fetch opportunities
  const { opportunities, isLoading, error, pagination } = useGHLOpportunities({
    locationId,
    pipelineId,
    pipelineStageId: stageId,
    status: statusFilter !== "all" ? (statusFilter as "open" | "won" | "lost" | "abandoned") : undefined,
    query: debouncedQuery || undefined,
    limit,
    page: currentPage,
  })

  // Type the opportunities
  const typedOpportunities = opportunities as Array<{
    id: string
    name: string
    pipelineId: string
    pipelineStageId: string
    status: "open" | "won" | "lost" | "abandoned"
    contactId: string
    monetaryValue?: number
    dateAdded: string
    dateUpdated: string
    [key: string]: unknown
  }>

  // Handle opportunity selection
  const handleOpportunityClick = React.useCallback(
    (opportunityId: string) => {
      const opp = typedOpportunities.find((o) => o.id === opportunityId)
      if (opp && onSelect) {
        onSelect(opp)
      }
    },
    [typedOpportunities, onSelect]
  )

  // Calculate pagination
  const totalPages = React.useMemo(() => {
    if (!pagination?.total) return 1
    return Math.ceil(pagination.total / limit)
  }, [pagination?.total])

  // Generate page numbers
  const pageNumbers = React.useMemo(() => {
    const pages: (number | "ellipsis")[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) {
        pages.push("ellipsis")
      }
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis")
      }
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }, [totalPages, currentPage])

  // Handle page change
  const handlePageChange = React.useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // Loading state
  if (isLoading && typedOpportunities.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        {(showSearch || showStatusFilter) && (
          <div className="flex gap-2">
            {showSearch && <Skeleton className="h-10 flex-1" />}
            {showStatusFilter && <Skeleton className="h-10 w-32" />}
          </div>
        )}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading opportunities</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Failed to load opportunities. Please try again."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Filters */}
      {(showSearch || showStatusFilter) && (
        <div className="flex gap-2">
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          {showStatusFilter && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Empty state */}
      {typedOpportunities.length === 0 ? (
        <Alert>
          <Search className="h-4 w-4" />
          <AlertTitle>No opportunities found</AlertTitle>
          <AlertDescription>
            {debouncedQuery || statusFilter !== "all"
              ? "No opportunities match your search criteria."
              : "No opportunities available."}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Opportunity list */}
          <ScrollArea className="flex-1">
            <div className="space-y-3">
              {typedOpportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className={cn(
                    "cursor-pointer transition-all rounded-lg",
                    selectedId === opportunity.id && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <GHLOpportunityCard
                    opportunity={opportunity}
                    stageName={stageNames[opportunity.pipelineStageId]}
                    contactName={contactNames[opportunity.contactId]}
                    onClick={onSelect ? () => handleOpportunityClick(opportunity.id) : undefined}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    aria-disabled={currentPage === 1}
                    className={cn(
                      currentPage === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>

                {pageNumbers.map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        aria-label={`Go to page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    aria-disabled={currentPage === totalPages}
                    className={cn(
                      currentPage === totalPages && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}
