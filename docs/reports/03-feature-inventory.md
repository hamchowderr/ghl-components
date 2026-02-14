# Section 3: Feature Inventory

> Generated: 2026-02-14

## Summary

| Category | Total Components | Complete | Partial | Status |
|----------|-----------------|----------|---------|--------|
| Auth | 4 | 4 | 0 | Functional |
| Contacts | 6 | 6 | 0 | Functional |
| Calendars | 6 | 6 | 0 | Functional |
| Opportunities | 7 | 7 | 0 | Functional |
| Conversations | 7 | 7 | 0 | Functional |
| Server Utilities | 3 | 3 | 0 | Complete |
| Type Definitions | 7 | 7 | 0 | Complete |
| Hooks (Core) | 4 | 4 | 0 | Complete |
| Hooks (Entity) | 22 | 22 | 0 | Thin wrappers |
| Showcase/Landing | 5 | 4 | 1 | Broken link |
| UI Primitives | 19 | 19 | 0 | Complete (shadcn) |
| **Total** | **90** | **89** | **1** | |

---

## User-Facing Features

### 1. Landing Page / Showcase

| Feature | Status | Files | Dependencies |
|---------|--------|-------|-------------|
| Hero section with CTA | Complete | `components/showcase/hero-section.tsx` | - |
| Features overview section | Complete | `components/showcase/features-section.tsx` | - |
| Component grid with tabs | Complete | `components/showcase/component-grid.tsx`, `component-card.tsx` | `lib/showcase/mock-data.ts` |
| Install command copy | Complete | `components/showcase/install-command.tsx` | - |
| **Issue:** GitHub link is placeholder | **Broken** | `app/page.tsx:30`, `components/showcase/hero-section.tsx` | Points to `your-org/ghl-components` |

### 2. OAuth Authentication Flow

| Feature | Status | Files | Dependencies |
|---------|--------|-------|-------------|
| GHL Provider (context) | Complete | `registry/new-york/auth/ghl-provider.tsx` | `@gohighlevel/api-client` |
| Connect Button (OAuth initiation) | Complete | `registry/new-york/auth/ghl-connect-button.tsx` | `useGHLAuth` hook |
| OAuth Callback handler | Complete | `registry/new-york/auth/ghl-oauth-callback.tsx` | `useGHLAuth` hook |
| Location Switcher (agency) | Complete | `registry/new-york/auth/ghl-location-switcher.tsx` | `useGHL` hook |

### 3. Contact Management

| Feature | Status | Files | Dependencies |
|---------|--------|-------|-------------|
| Contact display card | Complete | `registry/new-york/contacts/ghl-contact-card.tsx` | `useGHLContact` hook |
| Contact create/edit form | Complete | `registry/new-york/contacts/ghl-contact-form.tsx` | `useGHLContactCreate`, `useGHLContactUpdate` hooks, Zod |
| Scrollable contact list | Complete | `registry/new-york/contacts/ghl-contact-list.tsx` | `useGHLContacts` hook |
| Typeahead contact search | Complete | `registry/new-york/contacts/ghl-contact-search.tsx` | `useGHLContacts` hook |
| Modal contact picker | Complete | `registry/new-york/contacts/ghl-contact-picker.tsx` | `useGHLContacts` hook |
| Tag manager with autocomplete | Complete | `registry/new-york/contacts/ghl-tag-manager.tsx` | Local state |

### 4. Calendar & Booking

| Feature | Status | Files | Dependencies |
|---------|--------|-------|-------------|
| Time slot grid display | Complete | `registry/new-york/calendars/ghl-time-slot-grid.tsx` | `date-fns` |
| Availability date+time picker | Complete | `registry/new-york/calendars/ghl-availability-picker.tsx` | `useGHLAvailability` hook, `date-fns` |
| Calendar selector dropdown | Complete | `registry/new-york/calendars/ghl-calendar-select.tsx` | `useGHLCalendars` hook |
| Appointment display card | Complete | `registry/new-york/calendars/ghl-appointment-card.tsx` | `date-fns` |
| Appointment list (grouped by date) | Complete | `registry/new-york/calendars/ghl-appointment-list.tsx` | `useGHLAppointments` hook |
| Full booking form | Complete | `registry/new-york/calendars/ghl-booking-form.tsx` | `useGHLBookAppointment` hook, Zod |

### 5. Opportunities & Pipeline

| Feature | Status | Files | Dependencies |
|---------|--------|-------|-------------|
| Pipeline selector dropdown | Complete | `registry/new-york/opportunities/ghl-pipeline-select.tsx` | `useGHLPipelines` hook |
| Opportunity display card | Complete | `registry/new-york/opportunities/ghl-opportunity-card.tsx` | - |
| Stage selector (move opp) | Complete | `registry/new-york/opportunities/ghl-stage-selector.tsx` | `useGHLPipeline`, `useGHLOpportunityMove` hooks |
| Opportunity create/edit form | Complete | `registry/new-york/opportunities/ghl-opportunity-form.tsx` | `useGHLOpportunityCreate`, `useGHLOpportunityUpdate`, Zod |
| Stage column (kanban) | Complete | `registry/new-york/opportunities/ghl-stage-column.tsx` | - |
| Opportunity list view | Complete | `registry/new-york/opportunities/ghl-opportunity-list.tsx` | `useGHLOpportunities` hook |
| Full pipeline kanban board | Complete | `registry/new-york/opportunities/ghl-pipeline-board.tsx` | `useGHLPipeline`, `useGHLOpportunities` hooks |

### 6. Conversations & Messaging

| Feature | Status | Files | Dependencies |
|---------|--------|-------|-------------|
| Channel icon (SMS/Email/etc) | Complete | `registry/new-york/conversations/ghl-channel-icon.tsx` | - |
| Message bubble display | Complete | `registry/new-york/conversations/ghl-message-bubble.tsx` | `date-fns` |
| Channel selector dropdown | Complete | `registry/new-york/conversations/ghl-channel-selector.tsx` | - |
| Conversation header | Complete | `registry/new-york/conversations/ghl-conversation-header.tsx` | - |
| Message composer | Complete | `registry/new-york/conversations/ghl-message-composer.tsx` | `useGHLSendMessage` hook |
| Conversation thread | Complete | `registry/new-york/conversations/ghl-conversation-thread.tsx` | `useGHLMessages` hook |
| Conversation inbox list | Complete | `registry/new-york/conversations/ghl-conversation-list.tsx` | `useGHLConversations` hook |

---

## Backend/System Features

### 7. Webhook Processing

| Feature | Status | Files | Dependencies |
|---------|--------|-------|-------------|
| RSA-SHA256 signature verification | Complete | `registry/new-york/server/verify-signature.ts` | Node `crypto` |
| Webhook handler with routing | Complete | `registry/new-york/server/webhook-handler.ts` | Next.js API routes |
| Duplicate webhook prevention | Complete | `registry/new-york/server/webhook-handler.ts` | In-memory Set |
| Async webhook processing | Complete | `registry/new-york/server/webhook-handler.ts` | - |
| GHL constants (public key, URLs) | Complete | `registry/new-york/server/constants.ts` | - |

### 8. Type System

| Type Module | Status | File |
|-------------|--------|------|
| Contact types | Complete | `registry/new-york/server/types/contact.ts` |
| Opportunity types | Complete | `registry/new-york/server/types/opportunity.ts` |
| Calendar types | Complete | `registry/new-york/server/types/calendar.ts` |
| Conversation types | Complete | `registry/new-york/server/types/conversation.ts` |
| Webhook types | Complete | `registry/new-york/server/types/webhook.ts` |
| OAuth types | Complete | `registry/new-york/server/types/oauth.ts` |
| Type index/re-exports | Complete | `registry/new-york/server/types/index.ts` |

### 9. Registry Infrastructure

| Feature | Status | Files |
|---------|--------|-------|
| Registry declaration | Complete | `registry.json` (30 items) |
| Registry build pipeline | Complete | `package.json` scripts |
| CORS headers for registry | Complete | `vercel.json` |
| Registry validation tests | Complete | `__tests__/registry/registry-validation.test.ts` |
| Registry endpoint tests | Complete | `scripts/tests/` |

---

## Not Implemented (Declared in Roadmap)

| Feature | Roadmap Phase | Status |
|---------|--------------|--------|
| `<GHLErrorBoundary>` | Phase 1 | Not started |
| `<GHLConnectionStatus>` | Phase 1 | Not started |
| `<GHLContactAvatar>` (standalone) | Phase 2 | Not started (inline in ContactCard) |
| `<GHLContactBadge>` | Phase 2 | Not started |
| `<GHLCustomFieldsDisplay>` | Phase 2 | Not started |
| `<GHLNoteComposer>` | Phase 2 | Not started |
| `<GHLQuickActions>` | Phase 2 | Not started |
| `useGHLContactDelete` hook | Phase 2 | Not started |
| `useGHLContactTags` hook | Phase 2 | Not started |
| `useGHLContactNotes` hook | Phase 2 | Not started |
| `useGHLContactTasks` hook | Phase 2 | Not started |
| `<GHLCalendarView>` | Phase 3 | Not started |
| `<GHLAppointmentReschedule>` | Phase 3 | Not started |
| `<GHLQuickBook>` | Phase 3 | Not started |
| `<GHLStageIndicator>` | Phase 4 | Not started |
| `<GHLPipelineStats>` | Phase 4 | Not started |
| `<GHLOpportunityQuickAdd>` | Phase 4 | Not started |
| `<GHLUnreadBadge>` | Phase 5 | Not started |
| `<GHLQuickReplies>` | Phase 5 | Not started |
| `<GHLTemplateSelector>` | Phase 5 | Not started |
| All Phase 6 (Campaigns) | Phase 6 | Not started |
| All Phase 7 (Composites) | Phase 7 | Not started |

---

## Dead Code / Unused Files

| File | Status | Notes |
|------|--------|-------|
| `registry/new-york/blocks/complex-component/` | Unused | Template example (Pokemon card) - from scaffold |
| `registry/new-york/blocks/example-form/` | Unused | Template example - from scaffold |
| `registry/new-york/blocks/example-with-css/` | Unused | Template example - from scaffold |
| `registry/new-york/blocks/hello-world/` | Unused | Template example - from scaffold |
| `stories/Button.stories.ts` | Unused | Default Storybook template stories |
| `stories/Header.stories.ts` | Unused | Default Storybook template stories |
| `stories/Page.stories.ts` | Unused | Default Storybook template stories |
| `components/open-in-v0-button.tsx` | Unused | Template scaffold component |

---

## Known Issues

| Issue | Severity | Location |
|-------|----------|----------|
| GitHub URL is placeholder (`your-org/ghl-components`) | Medium | `app/page.tsx:30` |
| TypeScript errors suppressed during build | High | `next.config.ts:7` |
| Webhook dedup uses in-memory Set (lost on restart) | Medium | `registry/new-york/server/webhook-handler.ts:14` |
| `GHL_CLIENT_SECRET` accessed on client via `process.env` | High | `registry/new-york/auth/ghl-provider.tsx:44` |
