# GHL Component Registry Roadmap

> A shadcn-style component registry for GoHighLevel integrations, designed to help "vibe coders" connect to GHL without wrestling with API complexity.

## Overview

**Registry Name:** `@ghl-ui` (or similar)  
**Target Framework:** Next.js (App Router) + React  
**Styling:** Tailwind CSS + shadcn/ui primitives  
**Auth Model:** OAuth 2.0 first (with Private Integration Token fallback for simple use cases)

---

## Phase Summary

| Phase | Focus | Key Deliverables |
|-------|-------|------------------|
| 1 | Foundation + OAuth + Webhooks | Auth flow, client, types, webhook verification |
| 2 | Contacts | Forms, cards, search, tags + contact webhooks |
| 3 | Calendars | Booking flow with shadcn Calendar + appointment webhooks |
| 4 | Opportunities | Pipeline board, kanban + opportunity webhooks |
| 5 | Conversations | Inbox, threads, messaging + message webhooks |
| 6 | Campaigns | Enrollment, workflow triggers |
| 7 | Composites | Full-page components (Hub, Inbox, Dashboard) |

---

## Phase 1: Foundation + OAuth + Webhook Core

> Goal: Establish auth (OAuth-first design), core utilities, and webhook verification — the skeleton everything hangs on.

### 1.1 Core Utilities

| Item | Type | Description | Priority |
|------|------|-------------|----------|
| `ghl-client.ts` | Utility | Base fetch wrapper with auth headers, Version header, base URL, error normalization | P0 |
| `types/index.ts` | Types | Shared TypeScript types for all GHL entities | P0 |
| `types/contact.ts` | Types | Contact entity types, custom fields, tags | P0 |
| `types/opportunity.ts` | Types | Opportunity, Pipeline, Stage types | P0 |
| `types/conversation.ts` | Types | Message, Thread, Conversation types | P0 |
| `types/calendar.ts` | Types | Calendar, Event, Appointment types | P0 |
| `types/api-responses.ts` | Types | Paginated response wrappers, error types | P0 |
| `types/webhook.ts` | Types | Base webhook payload, event type unions | P0 |

### 1.2 OAuth Utilities

| Utility | Type | Description | Priority |
|---------|------|-------------|----------|
| `getGHLAuthUrl(config)` | Function | Generate OAuth authorization URL | P0 |
| `exchangeGHLCode(code)` | Function | Exchange auth code for tokens | P0 |
| `refreshGHLToken(refreshToken)` | Function | Refresh expired access token | P0 |
| `GHLOAuthConfig` | Type | Configuration type for OAuth | P0 |

### 1.3 Webhook Core Utilities

| Utility | Type | Description | Priority |
|---------|------|-------------|----------|
| `GHL_PUBLIC_KEY` | Constant | RSA public key for signature verification | P0 |
| `verifyGHLSignature(payload, signature)` | Function | Verify webhook authenticity (RSA) | P0 |
| `withGHLWebhook(handlers)` | HOF | Next.js API route wrapper with verification + deduplication | P0 |
| `parseGHLWebhook(body)` | Function | Parse and type webhook payload | P0 |

### 1.4 Provider Components

| Component | Description | Props | Priority |
|-----------|-------------|-------|----------|
| `<GHLProvider>` | Context provider with OAuth state, token refresh, location context | `config`, `children` | P0 |
| `<GHLErrorBoundary>` | Catches GHL API errors, shows friendly messages | `fallback`, `onError` | P1 |
| `<GHLConnectButton>` | "Connect to GHL" OAuth button | `clientId`, `redirectUri`, `scopes`, `onSuccess` | P0 |
| `<GHLOAuthCallback>` | Callback page handler | `onSuccess`, `onError` | P0 |
| `<GHLLocationSwitcher>` | Switch between locations (agency accounts) | `locations`, `value`, `onChange` | P1 |
| `<GHLConnectionStatus>` | Show connected account info | `connection` | P2 |

### 1.5 Core Hooks

| Hook | Description | Returns | Priority |
|------|-------------|---------|----------|
| `useGHL()` | Access to authenticated GHL client from context | `{ client, locationId, isReady, isConnected }` | P0 |
| `useGHLQuery()` | Generic data fetching hook with caching | `{ data, isLoading, error, refetch }` | P0 |
| `useGHLMutation()` | Generic mutation hook with optimistic updates | `{ mutate, isLoading, error }` | P0 |
| `useGHLAuth()` | OAuth state and actions | `{ connect, disconnect, isConnected, token }` | P0 |

---

## Phase 2: Contacts

> Goal: Complete vertical slice for the most common GHL entity.

### 2.1 Contact Hooks

| Hook | Description | Returns | Priority |
|------|-------------|---------|----------|
| `useGHLContacts()` | Search/list contacts with pagination | `{ contacts, isLoading, error, fetchMore, hasMore }` | P0 |
| `useGHLContact(id)` | Single contact by ID | `{ contact, isLoading, error, refetch }` | P0 |
| `useGHLContactCreate()` | Create new contact | `{ create, isLoading, error }` | P0 |
| `useGHLContactUpdate()` | Update existing contact | `{ update, isLoading, error }` | P0 |
| `useGHLContactDelete()` | Delete contact | `{ delete, isLoading, error }` | P1 |
| `useGHLContactTags()` | Add/remove tags from contact | `{ addTag, removeTag, isLoading }` | P1 |
| `useGHLContactNotes(id)` | Get/add notes for contact | `{ notes, addNote, isLoading }` | P1 |
| `useGHLContactTasks(id)` | Get/add tasks for contact | `{ tasks, addTask, completeTask }` | P2 |

### 2.2 Contact Display Components

| Component | Description | Props | Priority |
|-----------|-------------|-------|----------|
| `<GHLContactCard>` | Display card with name, email, phone, tags | `contactId` or `contact`, `showTags`, `showCustomFields` | P0 |
| `<GHLContactAvatar>` | Avatar with initials/image fallback | `contact`, `size` | P1 |
| `<GHLContactList>` | Virtualized list of contacts | `contacts`, `onSelect`, `selectedId` | P0 |
| `<GHLContactSearch>` | Search input with typeahead | `onSelect`, `placeholder` | P0 |
| `<GHLContactBadge>` | Compact inline contact reference | `contact`, `onClick` | P2 |
| `<GHLTagList>` | Display tags with colors | `tags`, `onRemove`, `editable` | P1 |
| `<GHLCustomFieldsDisplay>` | Render custom fields dynamically | `customFields`, `schema` | P1 |

### 2.3 Contact Action Components

| Component | Description | Props | Priority |
|-----------|-------------|-------|----------|
| `<GHLContactForm>` | Create/edit contact form | `contact?`, `onSuccess`, `onCancel` | P0 |
| `<GHLContactPicker>` | Modal/dropdown to select contact | `onSelect`, `multiple`, `filter` | P0 |
| `<GHLTagManager>` | Add/remove tags with autocomplete | `contactId`, `availableTags` | P1 |
| `<GHLNoteComposer>` | Add note to contact | `contactId`, `onSuccess` | P1 |
| `<GHLQuickActions>` | Action buttons (call, email, SMS) | `contact` | P2 |

### 2.4 Contact Webhook Handlers

| Handler | Event | Description | Priority |
|---------|-------|-------------|----------|
| `onContactCreate` | `ContactCreate` | New contact created | P0 |
| `onContactUpdate` | `ContactUpdate` | Contact updated | P0 |
| `onContactDelete` | `ContactDelete` | Contact deleted | P1 |
| `onContactDndUpdate` | `ContactDndUpdate` | DND status changed | P2 |
| `onContactTagUpdate` | `ContactTagUpdate` | Tags added/removed | P1 |

---

## Phase 3: Calendars & Appointments

> Goal: Booking and appointment management — the natural next step after capturing a contact.

### 3.1 Calendar Hooks

| Hook | Description | Returns | Priority |
|------|-------------|---------|----------|
| `useGHLCalendars()` | List calendars | `{ calendars, isLoading }` | P0 |
| `useGHLCalendar(id)` | Single calendar with settings | `{ calendar, isLoading }` | P1 |
| `useGHLAppointments(calendarId, dateRange)` | Appointments in range | `{ appointments, isLoading }` | P0 |
| `useGHLAppointment(id)` | Single appointment | `{ appointment, isLoading }` | P1 |
| `useGHLAvailability(calendarId, date)` | Available slots for date | `{ slots, isLoading }` | P0 |
| `useGHLBookAppointment()` | Book appointment | `{ book, isLoading, error }` | P0 |
| `useGHLCancelAppointment()` | Cancel appointment | `{ cancel, isLoading, error }` | P1 |

### 3.2 Calendar Display Components

| Component | Description | Props | Priority |
|-----------|-------------|-------|----------|
| `<GHLCalendarView>` | Month/week/day calendar view | `calendarId`, `view`, `onDateSelect` | P1 |
| `<GHLAppointmentList>` | List of upcoming appointments | `appointments`, `onSelect` | P0 |
| `<GHLAppointmentCard>` | Single appointment display | `appointment`, `onClick` | P0 |
| `<GHLAvailabilityPicker>` | Select from available slots | `slots`, `onSelect`, `selectedSlot` | P0 |
| `<GHLCalendarSelect>` | Dropdown to select calendar | `value`, `onChange` | P0 |
| `<GHLTimeSlotGrid>` | Visual time slot selection | `date`, `slots`, `onSelect` | P1 |

### 3.3 Calendar Action Components

| Component | Description | Props | Priority |
|-----------|-------------|-------|----------|
| `<GHLBookingForm>` | Full booking flow (integrates with shadcn Calendar) | `calendarId`, `contactId?`, `onSuccess` | P0 |
| `<GHLAppointmentReschedule>` | Reschedule existing appointment | `appointment`, `onSuccess` | P1 |
| `<GHLQuickBook>` | Minimal booking widget | `calendarId`, `onSuccess` | P2 |

### 3.4 Calendar Webhook Handlers

| Handler | Event | Description | Priority |
|---------|-------|-------------|----------|
| `onAppointmentCreate` | `AppointmentCreate` | Appointment booked | P0 |
| `onAppointmentUpdate` | `AppointmentUpdate` | Appointment modified | P0 |
| `onAppointmentDelete` | `AppointmentDelete` | Appointment cancelled | P1 |

---

## Phase 4: Opportunities & Pipelines

> Goal: Sales pipeline visualization and management.

### 4.1 Pipeline Hooks

| Hook | Description | Returns | Priority |
|------|-------------|---------|----------|
| `useGHLPipelines()` | List all pipelines | `{ pipelines, isLoading, error }` | P0 |
| `useGHLPipeline(id)` | Single pipeline with stages | `{ pipeline, stages, isLoading }` | P0 |
| `useGHLOpportunities(pipelineId)` | Opportunities in pipeline | `{ opportunities, isLoading, fetchMore }` | P0 |
| `useGHLOpportunity(id)` | Single opportunity | `{ opportunity, isLoading, error }` | P0 |
| `useGHLOpportunityCreate()` | Create opportunity | `{ create, isLoading, error }` | P0 |
| `useGHLOpportunityUpdate()` | Update opportunity | `{ update, isLoading, error }` | P0 |
| `useGHLOpportunityMove()` | Move to different stage | `{ move, isLoading, error }` | P0 |

### 4.2 Pipeline Display Components

| Component | Description | Props | Priority |
|-----------|-------------|-------|----------|
| `<GHLPipelineBoard>` | Kanban board view | `pipelineId`, `onCardClick`, `onCardMove` | P0 |
| `<GHLPipelineSelect>` | Dropdown to select pipeline | `value`, `onChange` | P0 |
| `<GHLStageColumn>` | Single stage column in kanban | `stage`, `opportunities`, `onDrop` | P0 |
| `<GHLOpportunityCard>` | Card in pipeline board | `opportunity`, `onClick`, `draggable` | P0 |
| `<GHLOpportunityList>` | List view of opportunities | `opportunities`, `onSelect` | P1 |
| `<GHLStageIndicator>` | Visual stage progress indicator | `currentStage`, `allStages` | P1 |
| `<GHLPipelineStats>` | Pipeline value/count summary | `pipelineId` | P2 |

### 4.3 Opportunity Action Components

| Component | Description | Props | Priority |
|-----------|-------------|-------|----------|
| `<GHLOpportunityForm>` | Create/edit opportunity | `opportunity?`, `pipelineId`, `onSuccess` | P0 |
| `<GHLStageSelector>` | Move opportunity between stages | `opportunity`, `onMove` | P0 |
| `<GHLOpportunityQuickAdd>` | Inline add in stage column | `stageId`, `pipelineId`, `onSuccess` | P1 |

### 4.4 Opportunity Webhook Handlers

| Handler | Event | Description | Priority |
|---------|-------|-------------|----------|
| `onOpportunityCreate` | `OpportunityCreate` | New opportunity created | P0 |
| `onOpportunityUpdate` | `OpportunityUpdate` | Opportunity updated | P0 |
| `onOpportunityDelete` | `OpportunityDelete` | Opportunity deleted | P1 |
| `onOpportunityStageUpdate` | `OpportunityStageUpdate` | Stage changed | P0 |
| `onOpportunityStatusUpdate` | `OpportunityStatusUpdate` | Status changed | P1 |
| `onOpportunityMonetaryValueUpdate` | `OpportunityMonetaryValueUpdate` | Value changed | P2 |

---

## Phase 5: Conversations

> Goal: Messaging interface for SMS, email, and other channels.

### 5.1 Conversation Hooks

| Hook | Description | Returns | Priority |
|------|-------------|---------|----------|
| `useGHLConversations()` | List conversations | `{ conversations, isLoading, fetchMore }` | P0 |
| `useGHLConversation(id)` | Single conversation with messages | `{ conversation, messages, isLoading }` | P0 |
| `useGHLMessages(conversationId)` | Messages in conversation | `{ messages, isLoading, fetchMore }` | P0 |
| `useGHLSendMessage()` | Send SMS/email/etc | `{ send, isLoading, error }` | P0 |
| `useGHLConversationByContact(contactId)` | Get/create conversation for contact | `{ conversation, isLoading }` | P1 |

### 5.2 Conversation Display Components

| Component | Description | Props | Priority |
|-----------|-------------|-------|----------|
| `<GHLConversationList>` | List of conversations (inbox view) | `conversations`, `onSelect`, `selectedId` | P0 |
| `<GHLConversationThread>` | Message thread display | `conversationId` or `messages` | P0 |
| `<GHLMessageBubble>` | Single message bubble | `message`, `isOutbound` | P0 |
| `<GHLConversationHeader>` | Contact info + channel indicator | `conversation` | P1 |
| `<GHLChannelIcon>` | Icon for SMS/Email/FB/etc | `channel`, `size` | P1 |
| `<GHLUnreadBadge>` | Unread message count | `count` | P2 |

### 5.3 Conversation Action Components

| Component | Description | Props | Priority |
|-----------|-------------|-------|----------|
| `<GHLMessageComposer>` | Message input with send button | `conversationId`, `onSend`, `channels` | P0 |
| `<GHLChannelSelector>` | Select SMS/Email/etc | `value`, `onChange`, `available` | P1 |
| `<GHLQuickReplies>` | Predefined reply buttons | `replies`, `onSelect` | P2 |
| `<GHLTemplateSelector>` | Select message template | `onSelect`, `channel` | P2 |

### 5.4 Conversation Webhook Handlers

| Handler | Event | Description | Priority |
|---------|-------|-------------|----------|
| `onInboundMessage` | `InboundMessage` | Message received | P0 |
| `onOutboundMessage` | `OutboundMessage` | Message sent | P1 |
| `onConversationUnreadUpdate` | `ConversationUnreadUpdate` | Unread status changed | P2 |

---

## Phase 6: Campaigns & Workflows

> Goal: Marketing automation triggers and enrollment.

### 6.1 Campaign Hooks

| Hook | Description | Returns | Priority |
|------|-------------|---------|----------|
| `useGHLCampaigns()` | List campaigns | `{ campaigns, isLoading }` | P1 |
| `useGHLCampaign(id)` | Single campaign details | `{ campaign, isLoading }` | P2 |
| `useGHLEnrollContact()` | Enroll contact in campaign | `{ enroll, isLoading, error }` | P1 |
| `useGHLWorkflows()` | List workflows | `{ workflows, isLoading }` | P1 |
| `useGHLTriggerWorkflow()` | Trigger workflow for contact | `{ trigger, isLoading, error }` | P1 |

### 6.2 Campaign Components

| Component | Description | Props | Priority |
|-----------|-------------|-------|----------|
| `<GHLCampaignList>` | List of campaigns | `campaigns`, `onSelect` | P1 |
| `<GHLCampaignSelect>` | Dropdown to select campaign | `value`, `onChange` | P1 |
| `<GHLCampaignEnroller>` | Enroll contact UI | `contactId`, `onSuccess` | P1 |
| `<GHLWorkflowSelect>` | Select workflow to trigger | `value`, `onChange` | P1 |
| `<GHLWorkflowTriggerButton>` | One-click workflow trigger | `workflowId`, `contactId` | P2 |

---

## Phase 7: Composite Components

> Goal: Higher-level components combining multiple primitives for complete experiences.

| Component | Description | Combines | Priority |
|-----------|-------------|----------|----------|
| `<GHLContactDetail>` | Full contact page view | Card + Notes + Tasks + Conversations | P1 |
| `<GHLInbox>` | Full inbox experience | ConversationList + Thread + Composer | P1 |
| `<GHLSalesDashboard>` | Pipeline overview + stats | PipelineBoard + Stats + Filters | P2 |
| `<GHLBookingWidget>` | Embeddable booking flow | CalendarSelect + AvailabilityPicker + Form | P1 |
| `<GHLContactHub>` | Search + list + detail split view | Search + List + ContactDetail | P2 |
| `<GHLLeadCapture>` | Form that creates contact + opportunity | ContactForm + OpportunityForm | P2 |

---

## Appendix A: API Endpoint Reference

### Base Configuration
```
Base URL: https://services.leadconnectorhq.com
Auth Header: Authorization: Bearer {token}
Version Header: Version: 2021-07-28
```

### Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts/` | Search contacts (paginated) |
| GET | `/contacts/{id}` | Get contact by ID |
| POST | `/contacts/` | Create contact |
| PUT | `/contacts/{id}` | Update contact |
| DELETE | `/contacts/{id}` | Delete contact |
| POST | `/contacts/{id}/tags` | Add tags |
| DELETE | `/contacts/{id}/tags` | Remove tags |
| GET | `/contacts/{id}/notes` | Get notes |
| POST | `/contacts/{id}/notes` | Add note |
| GET | `/contacts/{id}/tasks` | Get tasks |
| POST | `/contacts/{id}/tasks` | Add task |

### Opportunities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/opportunities/pipelines` | Get all pipelines |
| GET | `/opportunities/search` | Search opportunities |
| GET | `/opportunities/{id}` | Get opportunity |
| POST | `/opportunities/` | Create opportunity |
| PUT | `/opportunities/{id}` | Update opportunity |
| PUT | `/opportunities/{id}/status` | Update status/stage |
| DELETE | `/opportunities/{id}` | Delete opportunity |

### Conversations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/conversations/` | List conversations |
| GET | `/conversations/{id}` | Get conversation |
| GET | `/conversations/{id}/messages` | Get messages |
| POST | `/conversations/messages` | Send message |
| POST | `/conversations/messages/inbound` | Process inbound |

### Calendars
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/calendars/` | List calendars |
| GET | `/calendars/{id}` | Get calendar |
| GET | `/calendars/{id}/free-slots` | Get availability |
| GET | `/calendars/events` | List appointments |
| GET | `/calendars/events/{id}` | Get appointment |
| POST | `/calendars/events` | Book appointment |
| PUT | `/calendars/events/{id}` | Update appointment |
| DELETE | `/calendars/events/{id}` | Cancel appointment |

### Campaigns & Workflows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/campaigns/` | List campaigns |
| POST | `/contacts/{id}/campaigns/{campaignId}` | Enroll in campaign |
| DELETE | `/contacts/{id}/campaigns/{campaignId}` | Remove from campaign |
| GET | `/workflows/` | List workflows |

---

## Appendix B: Webhook Events Reference

### Contact Events
- `ContactCreate` - New contact created
- `ContactUpdate` - Contact updated  
- `ContactDelete` - Contact deleted
- `ContactDndUpdate` - Do Not Disturb status changed
- `ContactTagUpdate` - Tags added/removed

### Opportunity Events
- `OpportunityCreate` - New opportunity created
- `OpportunityUpdate` - Opportunity updated
- `OpportunityDelete` - Opportunity deleted
- `OpportunityStageUpdate` - Stage changed
- `OpportunityStatusUpdate` - Status changed
- `OpportunityMonetaryValueUpdate` - Value changed
- `OpportunityAssignedToUpdate` - Assignment changed

### Appointment Events
- `AppointmentCreate` - Appointment booked
- `AppointmentUpdate` - Appointment modified
- `AppointmentDelete` - Appointment cancelled

### Task Events
- `TaskCreate` - Task created
- `TaskComplete` - Task completed
- `TaskDelete` - Task deleted

### Invoice Events
- `InvoiceCreate` - Invoice created
- `InvoiceUpdate` - Invoice updated
- `InvoiceDelete` - Invoice deleted
- `InvoiceSent` - Invoice sent
- `InvoiceViewed` - Invoice viewed
- `InvoicePartiallyPaid` - Partial payment received
- `InvoicePaid` - Full payment received
- `InvoiceVoid` - Invoice voided

### Conversation Events
- `ConversationUnreadUpdate` - Unread status changed
- `InboundMessage` - Message received
- `OutboundMessage` - Message sent

---

## Appendix C: Implementation Notes

### Pagination Pattern
GHL uses cursor-based pagination with `startAfter` and `startAfterId` parameters:
```typescript
interface GHLPaginatedResponse<T> {
  data: T[];
  meta: {
    startAfter?: number;
    startAfterId?: string;
    total?: number;
  };
}
```

### Error Handling Pattern
```typescript
interface GHLError {
  statusCode: number;
  message: string;
  error?: string;
}
```

### Rate Limits
- 200,000 requests/day per app per location
- 100 requests/10 seconds burst limit
- Monitor via `X-RateLimit-*` headers

### Custom Fields
Custom fields require a separate call to get field definitions, then map IDs to names:
```
GET /locations/{locationId}/customFields
```

---

## Appendix D: File Structure

```
ghl-components/
├── registry/
│   └── new-york/
│       ├── auth/
│       │   ├── ghl-provider.tsx
│       │   ├── ghl-connect-button.tsx
│       │   ├── ghl-oauth-callback.tsx
│       │   └── ghl-location-switcher.tsx
│       ├── contacts/
│       │   ├── ghl-contact-card.tsx
│       │   ├── ghl-contact-form.tsx
│       │   ├── ghl-contact-list.tsx
│       │   ├── ghl-contact-search.tsx
│       │   └── ghl-tag-manager.tsx
│       ├── calendars/
│       │   ├── ghl-booking-form.tsx
│       │   ├── ghl-availability-picker.tsx
│       │   └── ghl-calendar-select.tsx
│       ├── opportunities/
│       │   ├── ghl-pipeline-board.tsx
│       │   ├── ghl-opportunity-card.tsx
│       │   └── ghl-opportunity-form.tsx
│       ├── conversations/
│       │   ├── ghl-conversation-thread.tsx
│       │   └── ghl-message-composer.tsx
│       ├── campaigns/
│       │   └── ghl-campaign-enroller.tsx
│       └── server/
│           ├── constants.ts
│           ├── verify-signature.ts
│           ├── webhook-handler.ts
│           ├── ghl-client.ts
│           └── types/
│               ├── index.ts
│               ├── contact.ts
│               ├── opportunity.ts
│               ├── conversation.ts
│               ├── calendar.ts
│               ├── webhook.ts
│               └── oauth.ts
├── docs/
│   ├── ROADMAP.md
│   └── SHADCN-MAPPING.md
├── registry.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | TBD | Initial release - Phase 1 (Foundation + OAuth + Webhooks Core) |
| 0.2.0 | TBD | Phase 2 (Contacts) |
| 0.3.0 | TBD | Phase 3 (Calendars & Appointments) |
| 0.4.0 | TBD | Phase 4 (Opportunities & Pipelines) |
| 0.5.0 | TBD | Phase 5 (Conversations) |
| 0.6.0 | TBD | Phase 6 (Campaigns & Workflows) |
| 1.0.0 | TBD | Phase 7 (Composite Components) + Stable Release |
