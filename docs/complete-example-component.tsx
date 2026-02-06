"use client"

/**
 * Complete Example: Contact Manager Component
 *
 * This demonstrates a real-world component using both useGHLQuery and useGHLMutation
 * to create a fully functional contact management interface.
 */

import * as React from "react"
import { useGHLQuery } from "@/hooks/use-ghl-query"
import { useGHLMutation } from "@/hooks/use-ghl-mutation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/new-york/ui/card"
import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"

interface Contact {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

interface ContactManagerProps {
  locationId: string
}

export function ContactManager({ locationId }: ContactManagerProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  })

  // Query: Fetch contacts
  const {
    data: contactsData,
    isLoading: isLoadingContacts,
    error: contactsError,
    refetch: refetchContacts
  } = useGHLQuery<{ contacts: Contact[] }>(
    ['contacts', locationId, searchQuery],
    async (client) => {
      const response = await client.contacts.searchContactsAdvanced({
        locationId,
        query: searchQuery || undefined
      })
      return response
    },
    {
      refetchInterval: 30000, // Auto-refresh every 30 seconds
      onSuccess: (data) => {
        console.log(`Loaded ${data?.contacts?.length || 0} contacts`)
      },
      onError: (error) => {
        console.error('Failed to load contacts:', error)
      }
    }
  )

  // Mutation: Create contact
  const {
    mutate: createContact,
    isLoading: isCreatingContact,
    error: createError
  } = useGHLMutation<Contact, {
    locationId: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }>(
    (client, input) => client.contacts.createContact(input),
    {
      onSuccess: (data) => {
        console.log('Contact created:', data)
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: ""
        })
        setIsCreating(false)
        // Invalidate will trigger refetch of contacts query
      },
      onError: (error) => {
        console.error('Failed to create contact:', error)
      },
      invalidateQueries: [['contacts', locationId]]
    }
  )

  // Mutation: Update contact
  const {
    mutate: updateContact,
    isLoading: isUpdatingContact
  } = useGHLMutation<Contact, {
    contactId: string
    updates: Partial<Contact>
  }>(
    (client, { contactId, updates }) =>
      client.contacts.updateContact(contactId, updates),
    {
      onSuccess: () => {
        console.log('Contact updated')
      },
      invalidateQueries: [['contacts', locationId]]
    }
  )

  // Mutation: Delete contact
  const {
    mutate: deleteContact,
    isLoading: isDeletingContact
  } = useGHLMutation<void, string>(
    (client, contactId) => client.contacts.deleteContact(contactId),
    {
      onSuccess: () => {
        console.log('Contact deleted')
      },
      onError: (error) => {
        alert(`Failed to delete contact: ${error.message}`)
      },
      invalidateQueries: [['contacts', locationId]]
    }
  )

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault()

    createContact({
      locationId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || undefined
    })
  }

  const handleDeleteContact = (contactId: string, contactName: string) => {
    if (confirm(`Are you sure you want to delete ${contactName}?`)) {
      deleteContact(contactId)
    }
  }

  const contacts = contactsData?.contacts || []
  const isAnyMutationLoading = isCreatingContact || isUpdatingContact || isDeletingContact

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with Search */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Manager</CardTitle>
          <CardDescription>
            Manage contacts for location {locationId}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoadingContacts}
              />
            </div>
            <Button
              onClick={() => refetchContacts()}
              disabled={isLoadingContacts}
              variant="outline"
            >
              Refresh
            </Button>
            <Button
              onClick={() => setIsCreating(!isCreating)}
              disabled={isAnyMutationLoading}
            >
              {isCreating ? 'Cancel' : 'New Contact'}
            </Button>
          </div>

          {/* Create Contact Form */}
          {isCreating && (
            <form onSubmit={handleCreateContact} className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Create New Contact</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    disabled={isCreatingContact}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    disabled={isCreatingContact}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isCreatingContact}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={isCreatingContact}
                />
              </div>

              {createError && (
                <p className="text-destructive text-sm">
                  Error: {createError.message}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isCreatingContact}
                >
                  {isCreatingContact ? 'Creating...' : 'Create Contact'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  disabled={isCreatingContact}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Contacts ({contacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingContacts && (
            <div className="text-center py-8 text-muted-foreground">
              Loading contacts...
            </div>
          )}

          {contactsError && (
            <div className="text-center py-8 text-destructive">
              Error: {contactsError.message}
            </div>
          )}

          {!isLoadingContacts && !contactsError && contacts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No contacts found. Create your first contact to get started.
            </div>
          )}

          {!isLoadingContacts && contacts.length > 0 && (
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contact.email}
                    </p>
                    {contact.phone && (
                      <p className="text-sm text-muted-foreground">
                        {contact.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newEmail = prompt('Enter new email:', contact.email)
                        if (newEmail && newEmail !== contact.email) {
                          updateContact({
                            contactId: contact.id,
                            updates: { email: newEmail }
                          })
                        }
                      }}
                      disabled={isAnyMutationLoading}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteContact(
                        contact.id,
                        `${contact.firstName} ${contact.lastName}`
                      )}
                      disabled={isAnyMutationLoading}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Auto-refreshes every 30 seconds
        </CardFooter>
      </Card>
    </div>
  )
}

/**
 * Usage:
 *
 * Wrap your app with GHLProvider first:
 *
 * import { GHLProvider } from "@/registry/new-york/auth/ghl-provider"
 *
 * function App() {
 *   return (
 *     <GHLProvider apiKey="your-api-key">
 *       <ContactManager locationId="your-location-id" />
 *     </GHLProvider>
 *   )
 * }
 */
