"use client"

import * as React from "react"
import { Check, Loader2, Search } from "lucide-react"

import { useGHLContacts } from "@/hooks/use-ghl-contacts"
import { cn } from "@/lib/utils"
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
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export interface GHLContactSearchProps {
  /**
   * The location ID to search contacts in
   */
  locationId: string
  /**
   * Callback when a contact is selected
   */
  onSelect: (contact: Contact | Contact[]) => void
  /**
   * Placeholder text for the search input
   */
  placeholder?: string
  /**
   * Allow selecting multiple contacts
   * @default false
   */
  multiple?: boolean
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
  [key: string]: unknown
}

export function GHLContactSearch({
  locationId,
  onSelect,
  placeholder = "Search contacts...",
  multiple = false,
  className,
}: GHLContactSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [debouncedQuery, setDebouncedQuery] = React.useState("")
  const [selectedContacts, setSelectedContacts] = React.useState<Contact[]>([])

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Fetch contacts based on debounced query
  const { data, isLoading } = useGHLContacts(
    {
      locationId,
      query: debouncedQuery,
      limit: 10,
    },
    {
      refetchInterval: 0,
    }
  )

  const contacts = data?.contacts || []

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
  const handleSelect = (contact: Contact) => {
    if (multiple) {
      const isSelected = selectedContacts.some((c) => c.id === contact.id)
      let newSelection: Contact[]

      if (isSelected) {
        newSelection = selectedContacts.filter((c) => c.id !== contact.id)
      } else {
        newSelection = [...selectedContacts, contact]
      }

      setSelectedContacts(newSelection)
      onSelect(newSelection)
    } else {
      setSelectedContacts([contact])
      onSelect(contact)
      setOpen(false)
      setQuery("")
    }
  }

  // Check if contact is selected
  const isContactSelected = (contactId: string) => {
    return selectedContacts.some((c) => c.id === contactId)
  }

  // Get button text
  const getButtonText = () => {
    if (selectedContacts.length === 0) {
      return placeholder
    }
    if (multiple) {
      return `${selectedContacts.length} contact${selectedContacts.length === 1 ? "" : "s"} selected`
    }
    return getFullName(selectedContacts[0])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">{getButtonText()}</span>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {!isLoading && contacts.length === 0 && (
              <CommandEmpty>
                {query ? "No contacts found." : "Start typing to search contacts."}
              </CommandEmpty>
            )}
            {!isLoading && contacts.length > 0 && (
              <CommandGroup>
                {contacts.map((contact) => {
                  const isSelected = isContactSelected(contact.id)
                  return (
                    <CommandItem
                      key={contact.id}
                      value={contact.id}
                      onSelect={() => handleSelect(contact)}
                      className="flex items-center gap-3 py-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(contact)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {getFullName(contact)}
                        </div>
                        {(contact.email || contact.phone) && (
                          <div className="text-sm text-muted-foreground truncate">
                            {contact.email || contact.phone}
                          </div>
                        )}
                      </div>
                      {multiple && (
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
