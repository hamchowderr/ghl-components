# Interactive Contact Components

This guide covers the interactive components for searching and selecting contacts in your GoHighLevel application.

## Components Overview

### GHLContactSearch

A typeahead search component with dropdown results, perfect for inline contact selection.

**Features:**
- Real-time search with 300ms debounce
- Single or multi-select mode
- Keyboard navigation (arrow keys, enter to select)
- Shows contact avatar, name, and email/phone
- Loading states and empty states
- Popover dropdown for results

### GHLContactPicker

A modal dialog for browsing and selecting contacts with search functionality.

**Features:**
- Full-screen modal with search
- Single or multi-select mode
- Visual feedback for selected contacts
- Optional filter function
- Shows contact details (name, email, phone, company)
- Scrollable contact list
- Selected count display in multi-select mode

---

## GHLContactSearch

### Basic Usage

```tsx
import { GHLContactSearch } from "@/registry/new-york/contacts/ghl-contact-search"

function MyComponent() {
  const handleSelect = (contact) => {
    console.log("Selected:", contact)
  }

  return (
    <GHLContactSearch
      locationId="your-location-id"
      onSelect={handleSelect}
      placeholder="Search contacts..."
    />
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locationId` | `string` | Required | The GoHighLevel location ID |
| `onSelect` | `(contact: Contact \| Contact[]) => void` | Required | Callback when contact(s) selected |
| `placeholder` | `string` | `"Search contacts..."` | Input placeholder text |
| `multiple` | `boolean` | `false` | Allow multiple selections |
| `className` | `string` | - | Additional CSS classes |

### Multi-Select Mode

```tsx
<GHLContactSearch
  locationId="your-location-id"
  multiple
  onSelect={(contacts) => {
    console.log("Selected contacts:", contacts)
  }}
  placeholder="Search and select contacts..."
/>
```

In multi-select mode:
- Checkmarks appear next to selected contacts
- Dropdown stays open after selection
- `onSelect` receives an array of contacts
- Selected contacts can be toggled on/off

### Keyboard Navigation

- **Type** to search contacts
- **↓ Down Arrow** - Move to next result
- **↑ Up Arrow** - Move to previous result
- **Enter** - Select highlighted contact
- **Esc** - Close dropdown

### Styling

```tsx
<GHLContactSearch
  locationId="your-location-id"
  onSelect={handleSelect}
  className="w-96 shadow-lg"
/>
```

---

## GHLContactPicker

### Basic Usage

```tsx
import { useState } from "react"
import { GHLContactPicker } from "@/registry/new-york/contacts/ghl-contact-picker"
import { Button } from "@/components/ui/button"

function MyComponent() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Select Contact
      </Button>

      <GHLContactPicker
        locationId="your-location-id"
        open={open}
        onOpenChange={setOpen}
        onSelect={(contact) => {
          console.log("Selected:", contact)
        }}
      />
    </>
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locationId` | `string` | Required | The GoHighLevel location ID |
| `onSelect` | `(contacts: Contact \| Contact[]) => void` | Required | Callback when selection confirmed |
| `open` | `boolean` | - | Control dialog open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `multiple` | `boolean` | `false` | Allow multiple selections |
| `filter` | `(contact: Contact) => boolean` | - | Filter function to exclude contacts |
| `className` | `string` | - | Additional CSS classes |

### Multi-Select Mode

```tsx
const [open, setOpen] = useState(false)
const [selected, setSelected] = useState([])

<GHLContactPicker
  locationId="your-location-id"
  open={open}
  onOpenChange={setOpen}
  multiple
  onSelect={(contacts) => setSelected(contacts)}
/>
```

In multi-select mode:
- Selected contacts appear as badges at the top
- Badge count shows in the "Select" button
- Individual contacts can be removed from selection
- All selections confirmed together

### Filtering Contacts

Filter out specific contacts from the list:

```tsx
<GHLContactPicker
  locationId="your-location-id"
  open={open}
  onOpenChange={setOpen}
  filter={(contact) => {
    // Only show contacts with email addresses
    return !!contact.email
  }}
  onSelect={handleSelect}
/>
```

Common filter examples:

```tsx
// Only verified emails
filter={(c) => c.email && c.email.includes("@")}

// Exclude specific contact
filter={(c) => c.id !== currentUserId}

// Only contacts with phone numbers
filter={(c) => !!c.phone}

// Only contacts from specific company
filter={(c) => c.companyName === "Acme Corp"}

// Only contacts with specific tags
filter={(c) => c.tags?.includes("VIP")}
```

### Search Functionality

The picker includes built-in search:
- Searches across name, email, and phone
- 300ms debounce for optimal performance
- Shows real-time results as you type
- Empty state when no matches found

---

## Common Use Cases

### 1. Form Field Integration

Use GHLContactSearch as a form field:

```tsx
function ContactForm() {
  const [formData, setFormData] = useState({
    recipient: null,
    message: "",
  })

  return (
    <form>
      <div>
        <label>Recipient</label>
        <GHLContactSearch
          locationId="location-id"
          onSelect={(contact) =>
            setFormData({ ...formData, recipient: contact })
          }
        />
      </div>
      <div>
        <label>Message</label>
        <textarea
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />
      </div>
      <button type="submit">Send</button>
    </form>
  )
}
```

### 2. Team Assignment

Use GHLContactPicker for selecting team members:

```tsx
function TeamBuilder() {
  const [open, setOpen] = useState(false)
  const [members, setMembers] = useState([])

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Add Team Members ({members.length})
      </Button>

      <GHLContactPicker
        locationId="location-id"
        open={open}
        onOpenChange={setOpen}
        multiple
        onSelect={setMembers}
      />

      <div>
        {members.map((member) => (
          <div key={member.id}>
            {member.firstName} {member.lastName}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 3. Project Lead Selection

Exclude already-selected contacts from picker:

```tsx
function ProjectForm() {
  const [lead, setLead] = useState(null)
  const [members, setMembers] = useState([])

  return (
    <>
      {/* Select lead */}
      <GHLContactSearch
        locationId="location-id"
        onSelect={setLead}
        placeholder="Select project lead..."
      />

      {/* Select team members, excluding the lead */}
      <GHLContactPicker
        locationId="location-id"
        multiple
        filter={(contact) => contact.id !== lead?.id}
        onSelect={setMembers}
      />
    </>
  )
}
```

### 4. Contact Assignment with Verification

Only show contacts meeting specific criteria:

```tsx
function AssignManager() {
  const [manager, setManager] = useState(null)

  return (
    <GHLContactPicker
      locationId="location-id"
      filter={(contact) => {
        // Only show contacts with manager tag
        return contact.tags?.includes("Manager")
      }}
      onSelect={setManager}
    />
  )
}
```

---

## Comparison: When to Use Which

### Use GHLContactSearch when:
- ✅ Inline contact selection in a form
- ✅ Space is limited
- ✅ Simple, quick selection needed
- ✅ Minimal UI footprint desired
- ✅ Single contact selection (typically)

### Use GHLContactPicker when:
- ✅ Need to browse multiple contacts
- ✅ Multi-select functionality required
- ✅ Want to show more contact details
- ✅ Need modal/dialog interaction
- ✅ Filtering contacts before selection
- ✅ Managing complex selections

---

## Type Definitions

### Contact Type

```tsx
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
```

---

## Accessibility

Both components follow accessibility best practices:

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper labels for screen readers
- **Focus Management**: Correct focus handling
- **Role Attributes**: Appropriate ARIA roles
- **Screen Reader Support**: Descriptive announcements

### GHLContactSearch
- `role="combobox"` on trigger button
- `aria-expanded` state tracking
- `aria-label` on contact items

### GHLContactPicker
- `aria-label` on search input
- `aria-pressed` on contact buttons
- Focus trap within modal
- Escape key to close

---

## Performance

### Debouncing
Both components debounce search queries by 300ms to reduce API calls while maintaining responsiveness.

### Pagination
GHLContactPicker limits results to 50 contacts. For larger datasets, the search functionality helps users narrow results.

### Caching
The underlying `useGHLContacts` hook uses React Query for automatic caching and deduplication.

---

## Examples

See complete examples in:
- `docs/contact-search-example.tsx` - GHLContactSearch examples
- `docs/contact-picker-example.tsx` - GHLContactPicker examples

---

## Troubleshooting

### No results appearing
- Verify `locationId` is correct
- Check network tab for API errors
- Ensure GHL API credentials are configured

### Selection not working
- Verify `onSelect` callback is provided
- Check console for errors
- Ensure contact data structure is correct

### Slow search performance
- Debounce is set to 300ms by default
- Check network latency
- Verify API response times

### Styling issues
- Ensure shadcn/ui components are installed
- Verify Tailwind CSS is configured
- Check for CSS conflicts

---

## Dependencies

These components require:
- `@/hooks/use-ghl-contacts` - Contact fetching hook
- `@/components/ui/command` - Command palette (GHLContactSearch)
- `@/components/ui/popover` - Dropdown (GHLContactSearch)
- `@/components/ui/dialog` - Modal (GHLContactPicker)
- `@/components/ui/input` - Search input (GHLContactPicker)
- `@/components/ui/button` - Buttons
- `@/components/ui/avatar` - Contact avatars
- `@/components/ui/badge` - Selected tags
- `@/components/ui/scroll-area` - Scrollable lists
- `lucide-react` - Icons
