# GHL Registry: shadcn Component Mapping

> Track which shadcn primitives we're using for each GHL component.

---

## shadcn Components Checklist

### Form & Input Components

| shadcn Component | Used In GHL Component | Phase | Status |
|------------------|----------------------|-------|--------|
| `Form` | `<GHLContactForm>`, `<GHLBookingForm>`, `<GHLOpportunityForm>` | 2, 3, 4 | ⬜ |
| `Input` | `<GHLContactForm>`, `<GHLBookingForm>`, `<GHLMessageComposer>` | 2, 3, 5 | ⬜ |
| `Textarea` | `<GHLNoteComposer>`, `<GHLMessageComposer>` | 2, 5 | ⬜ |
| `Select` | `<GHLPipelineSelect>`, `<GHLCalendarSelect>`, `<GHLStageSelector>` | 3, 4 | ⬜ |
| `Checkbox` | `<GHLContactForm>` (custom fields), `<GHLTaskItem>` | 2 | ⬜ |
| `Radio Group` | `<GHLContactForm>` (custom fields), `<GHLChannelSelector>` | 2, 5 | ⬜ |
| `Switch` | `<GHLContactForm>` (DND toggle), Settings | 2 | ⬜ |
| `Label` | All form components | All | ⬜ |
| `Combobox` | `<GHLContactSearch>`, `<GHLTagManager>` | 2 | ⬜ |
| `Date Picker` | `<GHLBookingForm>`, `<GHLAppointmentReschedule>` | 3 | ⬜ |
| `Input OTP` | `<GHLOAuthCallback>` (verification) | 1 | ⬜ |

### Display Components

| shadcn Component | Used In GHL Component | Phase | Status |
|------------------|----------------------|-------|--------|
| `Card` | `<GHLContactCard>`, `<GHLOpportunityCard>`, `<GHLAppointmentCard>` | 2, 3, 4 | ⬜ |
| `Avatar` | `<GHLContactAvatar>`, `<GHLConversationHeader>`, `<GHLMessageBubble>` | 2, 5 | ⬜ |
| `Badge` | `<GHLTagList>`, `<GHLStageIndicator>`, `<GHLUnreadBadge>`, `<GHLChannelIcon>` | 2, 4, 5 | ⬜ |
| `Table` | `<GHLContactList>` (table view), `<GHLOpportunityList>` | 2, 4 | ⬜ |
| `Data Table` | `<GHLContactList>` (advanced), `<GHLAppointmentList>` | 2, 3 | ⬜ |
| `Calendar` | `<GHLCalendarView>`, `<GHLAvailabilityPicker>`, `<GHLBookingForm>` | 3 | ⬜ |
| `Skeleton` | All loading states | All | ⬜ |
| `Progress` | `<GHLStageIndicator>`, `<GHLPipelineStats>` | 4 | ⬜ |
| `Separator` | `<GHLContactDetail>`, `<GHLConversationThread>` | 2, 5 | ⬜ |
| `Scroll Area` | `<GHLContactList>`, `<GHLConversationThread>`, `<GHLStageColumn>` | 2, 4, 5 | ⬜ |
| `Hover Card` | `<GHLContactBadge>` (hover preview) | 2 | ⬜ |
| `Chart` | `<GHLPipelineStats>`, `<GHLSalesDashboard>` | 4, 7 | ⬜ |
| `Carousel` | `<GHLTimeSlotGrid>` (mobile) | 3 | ⬜ |

### Overlay & Dialog Components

| shadcn Component | Used In GHL Component | Phase | Status |
|------------------|----------------------|-------|--------|
| `Dialog` | `<GHLContactPicker>`, `<GHLContactForm>` (modal mode) | 2 | ⬜ |
| `Sheet` | `<GHLContactDetail>` (slide-out), `<GHLOpportunityDetail>` | 2, 4 | ⬜ |
| `Drawer` | `<GHLBookingForm>` (mobile), `<GHLMessageComposer>` (mobile) | 3, 5 | ⬜ |
| `Popover` | `<GHLTagManager>`, `<GHLQuickActions>`, `<GHLDatePicker>` | 2, 3 | ⬜ |
| `Tooltip` | All icon buttons, `<GHLQuickActions>` | All | ⬜ |
| `Alert Dialog` | Delete confirmations, `<GHLAppointmentCancel>` | 2, 3 | ⬜ |
| `Alert` | `<GHLErrorBoundary>`, form validation errors | 1 | ⬜ |
| `Sonner` / `Toast` | Success/error notifications after API calls | All | ⬜ |

### Navigation & Menu Components

| shadcn Component | Used In GHL Component | Phase | Status |
|------------------|----------------------|-------|--------|
| `Command` | `<GHLContactSearch>`, `<GHLGlobalSearch>` | 2 | ⬜ |
| `Dropdown Menu` | `<GHLQuickActions>`, `<GHLContactCard>` (actions menu) | 2 | ⬜ |
| `Context Menu` | `<GHLOpportunityCard>` (right-click), `<GHLContactCard>` | 2, 4 | ⬜ |
| `Tabs` | `<GHLContactDetail>` (notes/tasks/activity), `<GHLInbox>` | 2, 5 | ⬜ |
| `Pagination` | `<GHLContactList>`, `<GHLOpportunityList>` | 2, 4 | ⬜ |
| `Breadcrumb` | `<GHLContactHub>`, navigation | 7 | ⬜ |
| `Toggle` / `Toggle Group` | `<GHLCalendarView>` (day/week/month), view switchers | 3 | ⬜ |

### Layout Components

| shadcn Component | Used In GHL Component | Phase | Status |
|------------------|----------------------|-------|--------|
| `Resizable` | `<GHLContactHub>` (split view), `<GHLInbox>` | 5, 7 | ⬜ |
| `Collapsible` | `<GHLCustomFieldsDisplay>`, `<GHLContactDetail>` sections | 2 | ⬜ |
| `Accordion` | `<GHLContactDetail>` (expandable sections) | 2 | ⬜ |
| `Aspect Ratio` | `<GHLContactAvatar>`, image fields | 2 | ⬜ |

### Interactive Components

| shadcn Component | Used In GHL Component | Phase | Status |
|------------------|----------------------|-------|--------|
| `Button` | Every component with actions | All | ⬜ |
| `Slider` | Price range filters, `<GHLOpportunityForm>` (value) | 4 | ⬜ |

---

## GHL Components by Phase (with shadcn Dependencies)

### Phase 1: Foundation + OAuth

| GHL Component | shadcn Dependencies | Priority |
|---------------|---------------------|----------|
| `<GHLProvider>` | None (context only) | P0 |
| `<GHLErrorBoundary>` | `Alert` | P1 |
| `<GHLConnectButton>` | `Button` | P0 |
| `<GHLOAuthCallback>` | `Card`, `Skeleton`, `Alert` | P0 |
| `<GHLLocationSwitcher>` | `Select`, `Avatar`, `Badge` | P1 |
| Webhook utilities | None (server-side) | P0 |

**shadcn to install:** `button`, `alert`, `card`, `skeleton`, `select`, `avatar`, `badge`

---

### Phase 2: Contacts

| GHL Component | shadcn Dependencies | Priority |
|---------------|---------------------|----------|
| `<GHLContactCard>` | `Card`, `Avatar`, `Badge`, `Dropdown Menu` | P0 |
| `<GHLContactAvatar>` | `Avatar`, `Aspect Ratio` | P1 |
| `<GHLContactList>` | `Scroll Area`, `Card`, `Skeleton`, `Pagination` | P0 |
| `<GHLContactSearch>` | `Command`, `Popover`, `Input` | P0 |
| `<GHLContactBadge>` | `Badge`, `Hover Card` | P2 |
| `<GHLTagList>` | `Badge` | P1 |
| `<GHLCustomFieldsDisplay>` | `Collapsible`, `Separator`, `Label` | P1 |
| `<GHLContactForm>` | `Form`, `Input`, `Select`, `Checkbox`, `Switch`, `Label`, `Button`, `Sonner` | P0 |
| `<GHLContactPicker>` | `Dialog`, `Command`, `Input`, `Button` | P0 |
| `<GHLTagManager>` | `Popover`, `Command`, `Badge`, `Input` | P1 |
| `<GHLNoteComposer>` | `Textarea`, `Button`, `Sonner` | P1 |
| `<GHLQuickActions>` | `Dropdown Menu`, `Button`, `Tooltip` | P2 |
| `<GHLContactDetail>` | `Tabs`, `Sheet`, `Accordion`, `Separator`, + child components | P1 |
| Webhook handlers | None (server-side) | P0 |

**shadcn to install:** `form`, `input`, `textarea`, `select`, `checkbox`, `switch`, `label`, `command`, `popover`, `dialog`, `dropdown-menu`, `hover-card`, `tabs`, `sheet`, `accordion`, `collapsible`, `scroll-area`, `pagination`, `tooltip`, `separator`, `sonner`

---

### Phase 3: Calendars & Appointments

| GHL Component | shadcn Dependencies | Priority |
|---------------|---------------------|----------|
| `<GHLCalendarView>` | `Calendar`, `Toggle Group`, `Button` | P1 |
| `<GHLAppointmentList>` | `Card`, `Scroll Area`, `Skeleton`, `Badge` | P0 |
| `<GHLAppointmentCard>` | `Card`, `Avatar`, `Badge` | P0 |
| `<GHLAvailabilityPicker>` | `Calendar`, `Button`, `Scroll Area` | P0 |
| `<GHLCalendarSelect>` | `Select` | P0 |
| `<GHLTimeSlotGrid>` | `Button`, `Scroll Area`, `Carousel` (mobile) | P1 |
| `<GHLBookingForm>` | `Form`, `Calendar`, `Input`, `Select`, `Button`, `Drawer` (mobile) | P0 |
| `<GHLAppointmentReschedule>` | `Dialog`, `Calendar`, `Button`, `Date Picker` | P1 |
| Webhook handlers | None (server-side) | P0 |

**shadcn to install:** `calendar`, `toggle-group`, `carousel`, `drawer`, `date-picker`

---

### Phase 4: Opportunities & Pipelines

| GHL Component | shadcn Dependencies | Priority |
|---------------|---------------------|----------|
| `<GHLPipelineBoard>` | `Scroll Area`, `Card`, + child components | P0 |
| `<GHLPipelineSelect>` | `Select` | P0 |
| `<GHLStageColumn>` | `Card`, `Scroll Area`, `Badge` | P0 |
| `<GHLOpportunityCard>` | `Card`, `Avatar`, `Badge`, `Context Menu` | P0 |
| `<GHLOpportunityList>` | `Table`, `Pagination`, `Skeleton` | P1 |
| `<GHLStageIndicator>` | `Progress`, `Badge` | P1 |
| `<GHLPipelineStats>` | `Card`, `Chart` | P2 |
| `<GHLOpportunityForm>` | `Form`, `Input`, `Select`, `Slider`, `Button` | P0 |
| `<GHLStageSelector>` | `Select`, `Button` | P0 |
| `<GHLOpportunityQuickAdd>` | `Input`, `Button`, `Popover` | P1 |
| Webhook handlers | None (server-side) | P0 |

**shadcn to install:** `table`, `context-menu`, `progress`, `chart`, `slider`

---

### Phase 5: Conversations

| GHL Component | shadcn Dependencies | Priority |
|---------------|---------------------|----------|
| `<GHLConversationList>` | `Scroll Area`, `Card`, `Avatar`, `Badge` | P0 |
| `<GHLConversationThread>` | `Scroll Area`, `Avatar`, `Separator` | P0 |
| `<GHLMessageBubble>` | `Avatar` (custom styling, minimal shadcn) | P0 |
| `<GHLConversationHeader>` | `Avatar`, `Badge` | P1 |
| `<GHLChannelIcon>` | `Badge` (custom icons) | P1 |
| `<GHLUnreadBadge>` | `Badge` | P2 |
| `<GHLMessageComposer>` | `Textarea`, `Button`, `Popover`, `Drawer` (mobile) | P0 |
| `<GHLChannelSelector>` | `Radio Group`, `Toggle Group` | P1 |
| `<GHLQuickReplies>` | `Button` | P2 |
| `<GHLTemplateSelector>` | `Command`, `Dialog` | P2 |
| Webhook handlers | None (server-side) | P0 |

**shadcn to install:** `radio-group` (most already installed)

---

### Phase 6: Campaigns & Workflows

| GHL Component | shadcn Dependencies | Priority |
|---------------|---------------------|----------|
| `<GHLCampaignList>` | `Card`, `Scroll Area`, `Badge` | P1 |
| `<GHLCampaignSelect>` | `Select` | P1 |
| `<GHLCampaignEnroller>` | `Dialog`, `Select`, `Button` | P1 |
| `<GHLWorkflowSelect>` | `Select` | P1 |
| `<GHLWorkflowTriggerButton>` | `Button`, `Sonner` | P2 |

**shadcn to install:** None new

---

### Phase 7: Composite Components

| GHL Component | shadcn Dependencies | Priority |
|---------------|---------------------|----------|
| `<GHLContactHub>` | `Resizable`, + child components | P2 |
| `<GHLInbox>` | `Resizable`, + child components | P1 |
| `<GHLSalesDashboard>` | `Chart`, `Card`, + child components | P2 |
| `<GHLBookingWidget>` | Combines Phase 2 + 3 components | P1 |
| `<GHLLeadCapture>` | `Form`, + child components | P2 |

**shadcn to install:** `resizable`

---

## Installation Order

Based on phase dependencies, here's the optimal shadcn install order:

```bash
# Phase 1: Foundation
npx shadcn@latest add button alert card skeleton select avatar badge

# Phase 2: Contacts (bulk install)
npx shadcn@latest add form input textarea checkbox switch label command popover dialog dropdown-menu hover-card tabs sheet accordion collapsible scroll-area pagination tooltip separator sonner

# Phase 3: Calendars
npx shadcn@latest add calendar toggle-group carousel drawer

# Phase 4: Opportunities
npx shadcn@latest add table context-menu progress chart slider

# Phase 5: Conversations
npx shadcn@latest add radio-group

# Phase 7: Composites
npx shadcn@latest add resizable
```

---

## Summary: shadcn Coverage

| Total shadcn Components | Used | Unused |
|------------------------|------|--------|
| ~50 | 42 | ~8 |

**Unused shadcn components:**
- `Menubar` - Not needed (web app menus)
- `Navigation Menu` - Not needed (full nav systems)
- `Breadcrumb` - Maybe later
- `Input OTP` - Edge case only
- `Aspect Ratio` - Minimal use

We're using **~85% of shadcn** which shows good coverage and that shadcn is the right foundation.

---

## Agent Task Format

When assigning to an agent, use this template:

```
## Task: Implement <GHLComponentName>

**Phase:** X
**Priority:** P0/P1/P2

**shadcn dependencies:**
- component1
- component2

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|

**Hooks used:**
- useGHLXxx()

**Acceptance Criteria:**
- [ ] Component renders with loading state
- [ ] Component handles error state
- [ ] Component displays data correctly
- [ ] Component is accessible
- [ ] Component matches shadcn styling patterns
- [ ] TypeScript types are complete
```
