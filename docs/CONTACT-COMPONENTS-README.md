# Contact Components - Quick Reference

Quick reference for the interactive contact selection components.

## 🎯 Quick Start

### GHLContactSearch - Inline Typeahead
```tsx
import { GHLContactSearch } from "@/registry/new-york/contacts/ghl-contact-search"

<GHLContactSearch
  locationId="your-location-id"
  onSelect={(contact) => console.log(contact)}
  placeholder="Search contacts..."
/>
```

### GHLContactPicker - Modal Picker
```tsx
import { useState } from "react"
import { GHLContactPicker } from "@/registry/new-york/contacts/ghl-contact-picker"
import { Button } from "@/components/ui/button"

const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Select Contact</Button>
<GHLContactPicker
  locationId="your-location-id"
  open={open}
  onOpenChange={setOpen}
  onSelect={(contact) => console.log(contact)}
/>
```

---

## 📚 Component Overview

| Component | Type | Best For | Multi-Select | Filter |
|-----------|------|----------|--------------|--------|
| **GHLContactSearch** | Inline Dropdown | Forms, Quick Selection | ✅ | ❌ |
| **GHLContactPicker** | Modal Dialog | Browse, Team Building | ✅ | ✅ |

---

## 🔑 Common Props

### Both Components
- `locationId: string` - Required GHL location ID
- `onSelect: (contact | contacts) => void` - Selection callback
- `multiple?: boolean` - Enable multi-select (default: false)
- `className?: string` - Additional CSS classes

### GHLContactSearch Only
- `placeholder?: string` - Search placeholder text

### GHLContactPicker Only
- `open?: boolean` - Control dialog state
- `onOpenChange?: (open: boolean) => void` - State change callback
- `filter?: (contact) => boolean` - Filter contacts

---

## 💡 Common Patterns

### Single Contact Selection
```tsx
const [contact, setContact] = useState(null)

<GHLContactSearch
  locationId="loc_123"
  onSelect={setContact}
/>
```

### Multi-Contact Selection
```tsx
const [contacts, setContacts] = useState([])

<GHLContactPicker
  locationId="loc_123"
  open={open}
  onOpenChange={setOpen}
  multiple
  onSelect={setContacts}
/>
```

### Filtered Selection
```tsx
<GHLContactPicker
  locationId="loc_123"
  open={open}
  onOpenChange={setOpen}
  filter={(contact) => contact.tags?.includes("VIP")}
  onSelect={setContact}
/>
```

### Form Integration
```tsx
<form>
  <label>Assign To:</label>
  <GHLContactSearch
    locationId="loc_123"
    onSelect={(c) => setFormData({...formData, assignee: c})}
  />
  <button type="submit">Save</button>
</form>
```

---

## 🎨 Features

### GHLContactSearch
- ✅ Real-time search (300ms debounce)
- ✅ Keyboard navigation (arrows, enter, esc)
- ✅ Avatar with initials
- ✅ Shows name, email/phone
- ✅ Checkmarks for multi-select
- ✅ Loading indicator
- ✅ Empty state
- ✅ Popover positioning

### GHLContactPicker
- ✅ Full modal interface
- ✅ Search with debouncing
- ✅ Scrollable contact list
- ✅ Detailed contact info
- ✅ Selected count badge
- ✅ Remove selected items
- ✅ Filter function support
- ✅ Cancel/Confirm actions

---

## 🔍 Filter Examples

```tsx
// Only contacts with email
filter={(c) => !!c.email}

// Exclude specific contact
filter={(c) => c.id !== currentUserId}

// Only VIP contacts
filter={(c) => c.tags?.includes("VIP")}

// Only specific company
filter={(c) => c.companyName === "Acme Corp"}

// Complex filter
filter={(c) => c.email && c.phone && c.tags?.length > 0}
```

---

## ⌨️ Keyboard Shortcuts

### GHLContactSearch
- `Type` - Search contacts
- `↓` - Next result
- `↑` - Previous result
- `Enter` - Select highlighted
- `Esc` - Close dropdown

---

## 📖 Documentation

- **Full Guide**: `docs/contact-interactive-components.md`
- **Search Examples**: `docs/contact-search-example.tsx`
- **Picker Examples**: `docs/contact-picker-example.tsx`
- **Summary**: `docs/contact-components-summary.md`

---

## 🚀 Advanced Examples

### Team Builder
```tsx
function TeamBuilder() {
  const [lead, setLead] = useState(null)
  const [members, setMembers] = useState([])
  const [openPicker, setOpenPicker] = useState(false)

  return (
    <div>
      <div>
        <label>Project Lead</label>
        <GHLContactSearch
          locationId="loc_123"
          onSelect={setLead}
          placeholder="Select lead..."
        />
      </div>

      <div>
        <label>Team Members</label>
        <Button onClick={() => setOpenPicker(true)}>
          Add Members ({members.length})
        </Button>
        <GHLContactPicker
          locationId="loc_123"
          open={openPicker}
          onOpenChange={setOpenPicker}
          multiple
          filter={(c) => c.id !== lead?.id}
          onSelect={setMembers}
        />
      </div>
    </div>
  )
}
```

### Assignment Form
```tsx
function AssignmentForm() {
  const [formData, setFormData] = useState({
    title: "",
    assignedTo: null,
    watchers: [],
  })

  return (
    <form>
      <input
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
      />

      <GHLContactSearch
        locationId="loc_123"
        onSelect={(c) => setFormData({...formData, assignedTo: c})}
        placeholder="Assign to..."
      />

      <GHLContactPicker
        locationId="loc_123"
        multiple
        onSelect={(c) => setFormData({...formData, watchers: c})}
      />

      <button type="submit">Create Task</button>
    </form>
  )
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No results | Verify `locationId` and API credentials |
| TypeScript errors | Contact interface is in component file |
| Styling issues | Check shadcn/ui and Tailwind setup |
| Slow performance | Check network latency and API response |
| Multi-select broken | Ensure `multiple={true}` |

---

## 📦 Dependencies

**Hooks:**
- `useGHLContacts` from `@/hooks/use-ghl-contacts`

**UI Components:**
- Command, Popover (GHLContactSearch)
- Dialog, Input (GHLContactPicker)
- Button, Avatar, Badge, ScrollArea (both)

**Utilities:**
- `cn` from `@/lib/utils`
- Icons from `lucide-react`

---

## 📁 File Structure

```
registry/new-york/contacts/
├── ghl-contact-search.tsx      # Typeahead component
└── ghl-contact-picker.tsx      # Modal picker component

components/ui/
└── input.tsx                    # Input component

docs/
├── contact-interactive-components.md    # Full documentation
├── contact-search-example.tsx          # Search examples
├── contact-picker-example.tsx          # Picker examples
├── contact-components-summary.md       # Implementation summary
└── CONTACT-COMPONENTS-README.md        # This quick reference
```

---

## ✨ Component Comparison

### When to Use GHLContactSearch
- ✅ Inline form field
- ✅ Limited space
- ✅ Quick selection
- ✅ Simple UI

### When to Use GHLContactPicker
- ✅ Browse many contacts
- ✅ Multi-select needed
- ✅ Need filtering
- ✅ More details required
- ✅ Modal interaction preferred

---

## 🎯 Type Definition

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

## 💻 Installation

Both components use existing shadcn/ui components. If any are missing:

```bash
npx shadcn-ui@latest add command popover dialog button avatar badge scroll-area
```

---

**For complete documentation, see:** `docs/contact-interactive-components.md`

**For examples, see:**
- `docs/contact-search-example.tsx`
- `docs/contact-picker-example.tsx`
