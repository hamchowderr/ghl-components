"use client"

import * as React from "react"
import { MoreVertical, Mail, Phone, Building2 } from "lucide-react"

import { useGHLContact } from "@/hooks/use-ghl-contact"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export interface GHLContactCardProps {
  contactId?: string
  contact?: {
    id: string
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    companyName?: string
    tags?: string[]
    customFields?: Array<{ id: string; name: string; value: string }>
    [key: string]: unknown
  }
  showTags?: boolean
  showCustomFields?: boolean
  onEdit?: (contactId: string) => void
  onDelete?: (contactId: string) => void
  className?: string
}

export function GHLContactCard({
  contactId,
  contact: providedContact,
  showTags = true,
  showCustomFields = false,
  onEdit,
  onDelete,
  className,
}: GHLContactCardProps) {
  // Fetch contact data if only ID is provided
  const contactResult = useGHLContact(contactId, {
    enabled: !!contactId && !providedContact,
  })
  const fetchedContact = contactResult.contact as typeof providedContact
  const isLoading = contactResult.isLoading
  const error = contactResult.error

  const contact = providedContact || fetchedContact

  // Get initials from first and last name
  const getInitials = React.useMemo(() => {
    if (!contact) return "?"
    const first = contact.firstName?.[0] || ""
    const last = contact.lastName?.[0] || ""
    return (first + last).toUpperCase() || "?"
  }, [contact])

  // Get full name
  const fullName = React.useMemo(() => {
    if (!contact) return "Unknown"
    const parts = [contact.firstName, contact.lastName].filter(Boolean)
    return parts.length > 0 ? parts.join(" ") : "Unknown Contact"
  }, [contact])

  // Handle menu actions
  const handleEdit = React.useCallback(() => {
    if (contact && onEdit) {
      onEdit(contact.id)
    }
  }, [contact, onEdit])

  const handleDelete = React.useCallback(() => {
    if (contact && onDelete) {
      onDelete(contact.id)
    }
  }, [contact, onDelete])

  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTitle>Error loading contact</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Failed to load contact data"}
        </AlertDescription>
      </Alert>
    )
  }

  // No contact data
  if (!contact) {
    return (
      <Alert className={className}>
        <AlertTitle>No contact found</AlertTitle>
        <AlertDescription>
          The requested contact could not be found.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{getInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{fullName}</CardTitle>
          {contact.companyName && (
            <CardDescription className="flex items-center gap-1 mt-1">
              <Building2 className="h-3 w-3" />
              {contact.companyName}
            </CardDescription>
          )}
        </div>
        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Contact actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {contact.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href={`mailto:${contact.email}`}
              className="text-primary hover:underline"
            >
              {contact.email}
            </a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a
              href={`tel:${contact.phone}`}
              className="text-primary hover:underline"
            >
              {contact.phone}
            </a>
          </div>
        )}
        {showTags && contact.tags && contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {contact.tags.map((tag: string, index: number) => (
              <Badge key={`${tag}-${index}`} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {showCustomFields &&
          contact.customFields &&
          contact.customFields.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              {contact.customFields.map((field: { id: string; name: string; value: string }) => (
                <div key={field.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{field.name}:</span>
                  <span className="font-medium">{field.value}</span>
                </div>
              ))}
            </div>
          )}
      </CardContent>
    </Card>
  )
}
