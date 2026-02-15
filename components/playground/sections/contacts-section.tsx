"use client"

import * as React from "react"
import { usePlayground } from "../playground-provider"
import { DemoSection } from "../demo-section"
import { ContactCardPreview } from "../previews/contact-card-preview"
import { mockContacts } from "@/lib/showcase/mock-data"
import { Loader2 } from "lucide-react"

interface ContactPreview {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  companyName?: string
  tags?: string[]
  customFields?: Array<{ id: string; name: string; value: string }>
}

export function ContactsSection() {
  const { mode, isConnected, fetchGHL } = usePlayground()
  const [contacts, setContacts] = React.useState<ContactPreview[]>(mockContacts)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (mode === "live" && isConnected) {
      setIsLoading(true)
      fetchGHL<{ contacts?: Array<Record<string, unknown>> }>("contacts/", { limit: "5" })
        .then((data) => {
          if (data.contacts && data.contacts.length > 0) {
            setContacts(
              data.contacts.map((c) => ({
                id: (c.id as string) || "",
                firstName: (c.firstName as string) || undefined,
                lastName: (c.lastName as string) || undefined,
                email: (c.email as string) || undefined,
                phone: (c.phone as string) || undefined,
                companyName: (c.companyName as string) || undefined,
                tags: (c.tags as string[]) || [],
              }))
            )
          }
        })
        .catch(() => {
          setContacts(mockContacts)
        })
        .finally(() => setIsLoading(false))
    } else {
      setContacts(mockContacts)
    }
  }, [mode, isConnected, fetchGHL])

  return (
    <DemoSection
      title="Contacts"
      description="Contact cards, forms, lists, and tag management for GHL contacts."
      category="contacts"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.slice(0, 3).map((contact) => (
            <ContactCardPreview
              key={contact.id}
              contact={contact}
              showTags
            />
          ))}
        </div>
      )}
    </DemoSection>
  )
}
