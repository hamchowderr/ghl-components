"use client"

import * as React from "react"
import { Search, AlertCircle } from "lucide-react"

import { useGHLContacts } from "@/hooks/use-ghl-contacts"
import { GHLContactCard } from "./ghl-contact-card"
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
import { cn } from "@/lib/utils"

export interface GHLContactListProps {
  locationId: string
  onSelect?: (contact: {
    id: string
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    companyName?: string
    tags?: string[]
    [key: string]: unknown
  }) => void
  selectedId?: string
  searchQuery?: string
  showTags?: boolean
  showCustomFields?: boolean
  onEdit?: (contactId: string) => void
  onDelete?: (contactId: string) => void
  className?: string
}

export function GHLContactList({
  locationId,
  onSelect,
  selectedId,
  searchQuery,
  showTags = true,
  showCustomFields = false,
  onEdit,
  onDelete,
  className,
}: GHLContactListProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const limit = 10

  // Fetch contacts with search query
  const contactsResult = useGHLContacts({
    locationId,
    query: searchQuery,
    limit,
    offset: (currentPage - 1) * limit,
  })

  const contacts = contactsResult.contacts as Array<{
    id: string
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    companyName?: string
    tags?: string[]
    [key: string]: unknown
  }>
  const isLoading = contactsResult.isLoading
  const error = contactsResult.error
  const pagination = contactsResult.pagination

  // Reset to page 1 when search query changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Handle contact selection
  const handleContactClick = React.useCallback(
    (contact: typeof contacts[0]) => {
      if (onSelect) {
        onSelect(contact)
      }
    },
    [onSelect]
  )

  // Calculate pagination
  const totalPages = React.useMemo(() => {
    if (!pagination?.total) return 1
    return Math.ceil(pagination.total / limit)
  }, [pagination?.total, limit])

  // Generate page numbers to show
  const pageNumbers = React.useMemo(() => {
    const pages: (number | "ellipsis")[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push("ellipsis")
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis")
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }, [totalPages, currentPage])

  // Handle page change
  const handlePageChange = React.useCallback((page: number) => {
    setCurrentPage(page)
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
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
        <AlertTitle>Error loading contacts</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Failed to load contacts. Please try again."}
        </AlertDescription>
      </Alert>
    )
  }

  // Empty state
  if (!contacts || contacts.length === 0) {
    return (
      <Alert className={className}>
        <Search className="h-4 w-4" />
        <AlertTitle>No contacts found</AlertTitle>
        <AlertDescription>
          {searchQuery
            ? `No contacts match your search "${searchQuery}".`
            : "No contacts available for this location."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {contacts.map((contact: typeof contacts[0]) => (
            <div
              key={contact.id}
              onClick={() => handleContactClick(contact)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleContactClick(contact)
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Select contact ${contact.firstName} ${contact.lastName}`}
              className={cn(
                "cursor-pointer transition-all rounded-lg",
                selectedId === contact.id &&
                  "ring-2 ring-primary ring-offset-2"
              )}
            >
              <GHLContactCard
                contact={contact}
                showTags={showTags}
                showCustomFields={showCustomFields}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      </ScrollArea>

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
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                aria-disabled={currentPage === totalPages}
                className={cn(
                  currentPage === totalPages &&
                    "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
