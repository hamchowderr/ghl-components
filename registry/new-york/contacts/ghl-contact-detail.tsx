"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useGHLContact } from "@/hooks/use-ghl-contact"
import { GHLTagManager } from "./ghl-tag-manager"
import { GHLConversationList } from "../conversations/ghl-conversation-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react"
import type { GHLContact } from "@/registry/new-york/server/types/contact"

/**
 * Props for the GHLContactDetail component
 */
export interface GHLContactDetailProps {
  /**
   * The contact ID to display
   */
  contactId: string
  /**
   * The location ID for sub-components
   */
  locationId: string
  /**
   * Callback when edit is clicked
   */
  onEdit?: (contactId: string) => void
  /**
   * Callback when delete is clicked
   */
  onDelete?: (contactId: string) => void
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Get initials from a contact's name
 */
function getInitials(contact: GHLContact): string {
  const first = contact.firstName?.[0] || ""
  const last = contact.lastName?.[0] || ""
  if (first && last) return (first + last).toUpperCase()
  if (contact.name) {
    const parts = contact.name.trim().split(" ")
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?"
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return first.toUpperCase() || "?"
}

/**
 * Get the display name for a contact
 */
function getDisplayName(contact: GHLContact): string {
  if (contact.firstName || contact.lastName) {
    return [contact.firstName, contact.lastName].filter(Boolean).join(" ")
  }
  return contact.name || "Unknown Contact"
}

/**
 * Format a date string for display
 */
function formatDate(dateString?: string): string {
  if (!dateString) return "N/A"
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return dateString
  }
}

/**
 * Full contact detail page view with tabbed sections
 *
 * Displays contact information with tabs for overview,
 * conversations, and tag management.
 *
 * @example
 * ```tsx
 * <GHLContactDetail
 *   contactId="contact_123"
 *   locationId="loc_123"
 *   onEdit={(id) => router.push(`/contacts/${id}/edit`)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 * ```
 */
export function GHLContactDetail({
  contactId,
  locationId,
  onEdit,
  onDelete,
  className,
}: GHLContactDetailProps) {
  const { contact, isLoading, error, refetch } = useGHLContact(contactId)

  // Loading state
  if (isLoading) {
    return <ContactDetailSkeleton className={className} />
  }

  // Error state
  if (error) {
    return (
      <div className={cn("flex items-center justify-center p-6", className)}>
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load contact</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <span>{error.message || "An unexpected error occurred"}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="w-fit"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Empty state
  if (!contact) {
    return (
      <div className={cn("flex items-center justify-center p-6", className)}>
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Contact not found</AlertTitle>
          <AlertDescription>
            The contact you are looking for does not exist or has been removed.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const typedContact = contact as GHLContact

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Contact Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(typedContact)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-xl">
                  {getDisplayName(typedContact)}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {typedContact.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {typedContact.email}
                    </span>
                  )}
                  {typedContact.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {typedContact.phone}
                    </span>
                  )}
                  {typedContact.companyName && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {typedContact.companyName}
                    </span>
                  )}
                </div>
                {typedContact.tags && typedContact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {typedContact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(contactId)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(contactId)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <OverviewTab contact={typedContact} />
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="mt-4">
          <GHLConversationList
            locationId={locationId}
            height="500px"
          />
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Manage Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <GHLTagManager
                contactId={contactId}
                selectedTags={typedContact.tags || []}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * Overview tab content
 */
function OverviewTab({ contact }: { contact: GHLContact }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Company & Address Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow label="Company" value={contact.companyName} />
          <InfoRow label="Website" value={contact.website} />
          <InfoRow
            label="Address"
            value={
              [contact.address1, contact.city, contact.state, contact.postalCode, contact.country]
                .filter(Boolean)
                .join(", ") || undefined
            }
          />
          <InfoRow label="Timezone" value={contact.timezone} />
          <InfoRow label="Source" value={contact.source} />
          <InfoRow
            label="DND Status"
            value={contact.dnd ? "Active" : "Inactive"}
          />
        </CardContent>
      </Card>

      {/* Dates & Meta */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow
            label="Date Added"
            value={formatDate(contact.dateAdded)}
            icon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
          />
          <InfoRow
            label="Last Updated"
            value={formatDate(contact.dateUpdated)}
            icon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
          />
          <InfoRow
            label="Date of Birth"
            value={contact.dateOfBirth ? formatDate(contact.dateOfBirth) : undefined}
            icon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
          />
        </CardContent>
      </Card>

      {/* Custom Fields */}
      {contact.customFields && contact.customFields.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Custom Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {contact.customFields.map((field) => (
                <InfoRow
                  key={field.id}
                  label={field.key}
                  value={
                    Array.isArray(field.value)
                      ? field.value.join(", ")
                      : String(field.value)
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/**
 * Simple label-value display row
 */
function InfoRow({
  label,
  value,
  icon,
}: {
  label: string
  value?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2">
      {icon}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm truncate">{value || "N/A"}</p>
      </div>
    </div>
  )
}

/**
 * Loading skeleton for contact detail
 */
function ContactDetailSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  )
}
