"use client"

import * as React from "react"
import { Check, Search, X } from "lucide-react"

import { useGHLContacts } from "@/hooks/use-ghl-contacts"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export interface GHLContactPickerProps {
  /**
   * The location ID to fetch contacts from
   */
  locationId: string
  /**
   * Callback when contacts are selected
   */
  onSelect: (contacts: Contact | Contact[]) => void
  /**
   * Allow selecting multiple contacts
   * @default false
   */
  multiple?: boolean
  /**
   * Optional filter function to exclude certain contacts
   */
  filter?: (contact: Contact) => boolean
  /**
   * Control the open state of the dialog
   */
  open?: boolean
  /**
   * Callback when the open state changes
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Optional CSS class name
   */
  className?: string
}

interface Contact {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  companyName?: string
  tags?: string[]
  [key: string]: unknown
}

export function GHLContactPicker({
  locationId,
  onSelect,
  multiple = false,
  filter,
  open,
  onOpenChange,
  className,
}: GHLContactPickerProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [debouncedQuery, setDebouncedQuery] = React.useState("")
  const [selectedContacts, setSelectedContacts] = React.useState<Contact[]>([])

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch contacts based on debounced query
  const { data, isLoading } = useGHLContacts(
    {
      locationId,
      query: debouncedQuery,
      limit: 50,
    },
    {
      refetchInterval: 0,
    }
  )

  // Filter contacts if filter function is provided
  const contacts = React.useMemo(() => {
    const contactList = data?.contacts || []
    if (filter) {
      return contactList.filter(filter)
    }
    return contactList
  }, [data?.contacts, filter])

  // Reset selection when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSelectedContacts([])
      setSearchQuery("")
    }
  }, [open])

  // Get initials from contact name
  const getInitials = (contact: Contact) => {
    const first = contact.firstName?.[0] || ""
    const last = contact.lastName?.[0] || ""
    return (first + last).toUpperCase() || "?"
  }

  // Get full name
  const getFullName = (contact: Contact) => {
    const parts = [contact.firstName, contact.lastName].filter(Boolean)
    return parts.length > 0 ? parts.join(" ") : contact.email || "Unknown"
  }

  // Handle contact selection
  const handleToggleContact = (contact: Contact) => {
    if (multiple) {
      const isSelected = selectedContacts.some((c) => c.id === contact.id)
      if (isSelected) {
        setSelectedContacts(selectedContacts.filter((c) => c.id !== contact.id))
      } else {
        setSelectedContacts([...selectedContacts, contact])
      }
    } else {
      setSelectedContacts([contact])
    }
  }

  // Check if contact is selected
  const isContactSelected = (contactId: string) => {
    return selectedContacts.some((c) => c.id === contactId)
  }

  // Handle confirm selection
  const handleConfirm = () => {
    if (selectedContacts.length > 0) {
      onSelect(multiple ? selectedContacts : selectedContacts[0])
      onOpenChange?.(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setSelectedContacts([])
    onOpenChange?.(false)
  }

  // Remove selected contact (for multi-select)
  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter((c) => c.id !== contactId))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-2xl", className)}>
        <DialogHeader>
          <DialogTitle>
            {multiple ? "Select Contacts" : "Select Contact"}
          </DialogTitle>
          <DialogDescription>
            {multiple
              ? "Search and select one or more contacts."
              : "Search and select a contact."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contacts by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              aria-label="Search contacts"
            />
          </div>

          {/* Selected Contacts (Multi-select) */}
          {multiple && selectedContacts.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md">
              {selectedContacts.map((contact) => (
                <Badge
                  key={contact.id}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {getFullName(contact)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveContact(contact.id)}
                    aria-label={`Remove ${getFullName(contact)}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Contact List */}
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="p-4 space-y-2">
              {isLoading && (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-md"
                    >
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </>
              )}

              {!isLoading && contacts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? "No contacts found matching your search."
                      : "No contacts available."}
                  </p>
                </div>
              )}

              {!isLoading &&
                contacts.map((contact) => {
                  const isSelected = isContactSelected(contact.id)
                  return (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => handleToggleContact(contact)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors",
                        "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isSelected && "bg-accent"
                      )}
                      aria-pressed={isSelected}
                      aria-label={`${isSelected ? "Deselect" : "Select"} ${getFullName(contact)}`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(contact)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {getFullName(contact)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-0.5">
                          {contact.email && (
                            <div className="truncate">{contact.email}</div>
                          )}
                          {contact.phone && (
                            <div className="truncate">{contact.phone}</div>
                          )}
                          {contact.companyName && (
                            <div className="truncate">{contact.companyName}</div>
                          )}
                        </div>
                      </div>
                      {(multiple || isSelected) && (
                        <Check
                          className={cn(
                            "h-5 w-5 shrink-0 transition-opacity",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                      )}
                    </button>
                  )
                })}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedContacts.length === 0}
            aria-label={`Select ${selectedContacts.length} contact${selectedContacts.length === 1 ? "" : "s"}`}
          >
            Select
            {multiple && selectedContacts.length > 0 && (
              <span className="ml-1">({selectedContacts.length})</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
