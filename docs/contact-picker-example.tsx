"use client"

import { useState } from "react"
import { GHLContactPicker } from "@/registry/new-york/contacts/ghl-contact-picker"
import { Button } from "@/components/ui/button"

/**
 * Example: Basic Contact Picker
 *
 * Single-select modal contact picker
 */
export function BasicContactPickerExample() {
  const [open, setOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<any>(null)

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>Select Contact</Button>

      <GHLContactPicker
        locationId="your-location-id"
        open={open}
        onOpenChange={setOpen}
        onSelect={(contact) => {
          setSelectedContact(contact)
          console.log("Selected contact:", contact)
        }}
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
 * Example: Multi-Select Contact Picker
 *
 * Allow selecting multiple contacts in a modal
 */
export function MultiSelectContactPickerExample() {
  const [open, setOpen] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<any[]>([])

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>
        Select Contacts {selectedContacts.length > 0 && `(${selectedContacts.length})`}
      </Button>

      <GHLContactPicker
        locationId="your-location-id"
        open={open}
        onOpenChange={setOpen}
        multiple
        onSelect={(contacts) => {
          setSelectedContacts(Array.isArray(contacts) ? contacts : [contacts])
          console.log("Selected contacts:", contacts)
        }}
      />

      {selectedContacts.length > 0 && (
        <div className="p-4 border rounded-md">
          <h3 className="font-semibold">
            Selected Contacts ({selectedContacts.length}):
          </h3>
          <ul className="list-disc list-inside">
            {selectedContacts.map((contact) => (
              <li key={contact.id}>
                {contact.firstName} {contact.lastName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/**
 * Example: Contact Picker with Filter
 *
 * Filter contacts to only show specific ones
 */
export function FilteredContactPickerExample() {
  const [open, setOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<any>(null)

  // Only show contacts with a verified email
  const filterContacts = (contact: any) => {
    return contact.email && contact.email.includes("@")
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>
        Select Verified Contact
      </Button>

      <GHLContactPicker
        locationId="your-location-id"
        open={open}
        onOpenChange={setOpen}
        filter={filterContacts}
        onSelect={(contact) => {
          setSelectedContact(contact)
          console.log("Selected verified contact:", contact)
        }}
      />

      {selectedContact && (
        <div className="p-4 border rounded-md bg-green-50">
          <h3 className="font-semibold text-green-900">Verified Contact:</h3>
          <p className="text-green-800">
            {selectedContact.firstName} {selectedContact.lastName}
          </p>
          <p className="text-sm text-green-700">{selectedContact.email}</p>
        </div>
      )}
    </div>
  )
}

/**
 * Example: Contact Picker for Team Assignment
 *
 * Real-world use case: Assign contacts to a team or project
 */
export function TeamAssignmentContactPickerExample() {
  const [open, setOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [teamName, setTeamName] = useState("")

  const handleSaveTeam = () => {
    console.log("Saving team:", {
      name: teamName,
      members: teamMembers,
    })
    // API call to save team
    alert(`Team "${teamName}" created with ${teamMembers.length} members`)
  }

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id))
  }

  return (
    <div className="max-w-2xl space-y-6 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold">Create New Team</h2>

      <div>
        <label className="block text-sm font-medium mb-2">Team Name</label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Enter team name..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Team Members</label>
        <Button onClick={() => setOpen(true)} variant="outline" className="w-full">
          Add Members {teamMembers.length > 0 && `(${teamMembers.length} selected)`}
        </Button>

        <GHLContactPicker
          locationId="your-location-id"
          open={open}
          onOpenChange={setOpen}
          multiple
          onSelect={(contacts) => {
            setTeamMembers(Array.isArray(contacts) ? contacts : [contacts])
          }}
        />
      </div>

      {teamMembers.length > 0 && (
        <div className="p-4 bg-muted rounded-md">
          <h3 className="font-semibold mb-3">Selected Members:</h3>
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2 bg-background rounded-md"
              >
                <div>
                  <p className="font-medium">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleSaveTeam}
          disabled={!teamName || teamMembers.length === 0}
          className="flex-1"
        >
          Create Team
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

/**
 * Example: Contact Picker with State Management
 *
 * Integrate with form state management library
 */
export function ContactPickerWithStateExample() {
  const [formState, setFormState] = useState({
    projectName: "",
    projectLead: null as any,
    teamMembers: [] as any[],
  })
  const [openLead, setOpenLead] = useState(false)
  const [openTeam, setOpenTeam] = useState(false)

  const updateFormField = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-2xl space-y-6 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold">New Project</h2>

      <div>
        <label className="block text-sm font-medium mb-2">Project Name</label>
        <input
          type="text"
          value={formState.projectName}
          onChange={(e) => updateFormField("projectName", e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Project Lead</label>
        <Button
          onClick={() => setOpenLead(true)}
          variant="outline"
          className="w-full justify-start"
        >
          {formState.projectLead
            ? `${formState.projectLead.firstName} ${formState.projectLead.lastName}`
            : "Select project lead..."}
        </Button>

        <GHLContactPicker
          locationId="your-location-id"
          open={openLead}
          onOpenChange={setOpenLead}
          onSelect={(contact) => updateFormField("projectLead", contact)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Team Members</label>
        <Button
          onClick={() => setOpenTeam(true)}
          variant="outline"
          className="w-full justify-start"
        >
          {formState.teamMembers.length > 0
            ? `${formState.teamMembers.length} members selected`
            : "Select team members..."}
        </Button>

        <GHLContactPicker
          locationId="your-location-id"
          open={openTeam}
          onOpenChange={setOpenTeam}
          multiple
          filter={(contact) => contact.id !== formState.projectLead?.id}
          onSelect={(contacts) => updateFormField("teamMembers", contacts)}
        />
      </div>

      <Button
        className="w-full"
        disabled={
          !formState.projectName ||
          !formState.projectLead ||
          formState.teamMembers.length === 0
        }
      >
        Create Project
      </Button>
    </div>
  )
}
