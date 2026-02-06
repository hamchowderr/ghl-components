"use client"

import { useState } from "react"
import { GHLContactSearch } from "@/registry/new-york/contacts/ghl-contact-search"

/**
 * Example: Basic Contact Search
 *
 * Single-select contact search with typeahead
 */
export function BasicContactSearchExample() {
  const [selectedContact, setSelectedContact] = useState<any>(null)

  return (
    <div className="space-y-4">
      <GHLContactSearch
        locationId="your-location-id"
        onSelect={(contact) => {
          setSelectedContact(contact)
          console.log("Selected contact:", contact)
        }}
        placeholder="Search for a contact..."
      />

      {selectedContact && (
        <div className="p-4 border rounded-md">
          <h3 className="font-semibold">Selected Contact:</h3>
          <p>
            {selectedContact.firstName} {selectedContact.lastName}
          </p>
          <p className="text-sm text-muted-foreground">
            {selectedContact.email}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Example: Multi-Select Contact Search
 *
 * Allow selecting multiple contacts with checkmarks
 */
export function MultiSelectContactSearchExample() {
  const [selectedContacts, setSelectedContacts] = useState<any[]>([])

  return (
    <div className="space-y-4">
      <GHLContactSearch
        locationId="your-location-id"
        onSelect={(contacts) => {
          setSelectedContacts(Array.isArray(contacts) ? contacts : [contacts])
          console.log("Selected contacts:", contacts)
        }}
        placeholder="Search and select contacts..."
        multiple
      />

      {selectedContacts.length > 0 && (
        <div className="p-4 border rounded-md">
          <h3 className="font-semibold">
            Selected Contacts ({selectedContacts.length}):
          </h3>
          <ul className="list-disc list-inside">
            {selectedContacts.map((contact) => (
              <li key={contact.id}>
                {contact.firstName} {contact.lastName} - {contact.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/**
 * Example: Contact Search with Form Integration
 *
 * Use contact search in a form context
 */
export function FormContactSearchExample() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    recipient: null as any,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Send data to API
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-2">
          Select Recipient
        </label>
        <GHLContactSearch
          locationId="your-location-id"
          onSelect={(contact) =>
            setFormData({ ...formData, recipient: contact })
          }
          placeholder="Choose a contact..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Subject</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          className="w-full border rounded-md px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full border rounded-md px-3 py-2"
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        disabled={!formData.recipient}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
      >
        Send Message
      </button>
    </form>
  )
}

/**
 * Example: Contact Search with Custom Styling
 *
 * Customize the appearance of the search component
 */
export function CustomStyledContactSearchExample() {
  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Find Team Member</h2>
      <GHLContactSearch
        locationId="your-location-id"
        onSelect={(contact) => console.log("Selected:", contact)}
        placeholder="Type to search team..."
        className="shadow-lg"
      />
    </div>
  )
}
