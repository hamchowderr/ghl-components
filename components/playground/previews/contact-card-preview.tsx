"use client"

import * as React from "react"
import { MoreVertical, Mail, Phone, Building2 } from "lucide-react"
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

interface Contact {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  companyName?: string
  tags?: string[]
  customFields?: Array<{ id: string; name: string; value: string }>
}

interface ContactCardPreviewProps {
  contact: Contact
  showTags?: boolean
  showCustomFields?: boolean
  className?: string
}

export function ContactCardPreview({
  contact,
  showTags = true,
  showCustomFields = false,
  className,
}: ContactCardPreviewProps) {
  const initials = React.useMemo(() => {
    const first = contact.firstName?.[0] || ""
    const last = contact.lastName?.[0] || ""
    return (first + last).toUpperCase() || "?"
  }, [contact])

  const fullName = React.useMemo(() => {
    const parts = [contact.firstName, contact.lastName].filter(Boolean)
    return parts.length > 0 ? parts.join(" ") : "Unknown Contact"
  }, [contact])

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{initials}</AvatarFallback>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        {contact.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-primary">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-primary">{contact.phone}</span>
          </div>
        )}
        {showTags && contact.tags && contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {contact.tags.map((tag, index) => (
              <Badge key={`${tag}-${index}`} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {showCustomFields && contact.customFields && contact.customFields.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            {contact.customFields.map((field) => (
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
