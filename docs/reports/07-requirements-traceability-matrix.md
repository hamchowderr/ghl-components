# Section 7: Requirements Traceability Matrix (RTM)

> Generated: 2026-02-14

## How to Read This Matrix

| Column | Meaning |
|--------|---------|
| **ID** | Unique identifier for the requirement |
| **Requirement** | What the feature should do |
| **Phase** | Roadmap phase from `docs/ROADMAP.md` |
| **Implementation** | Files that fulfill this requirement |
| **Test Coverage** | Tests that verify it works |
| **Deploy Status** | Where this is currently live |
| **Security** | Whether it passed the security audit |

---

## RTM: Foundation & Infrastructure

| ID | Requirement | Phase | Implementation | Test Coverage | Deploy | Security |
|----|-------------|-------|---------------|--------------|--------|----------|
| F-001 | Registry declaration with all components | 1 | `registry.json` | `registry-validation.test.ts` | Prod | Pass |
| F-002 | Registry build pipeline generates distributable JSON | 1 | `package.json` (build:registry script) | `registry-endpoints.spec.ts` | Prod | Pass |
| F-003 | Registry endpoints serve JSON with CORS | 1 | `vercel.json` (headers config) | `registry-endpoints.spec.ts` | Prod | Pass |
| F-004 | Landing page with component showcase | 1 | `app/page.tsx`, `components/showcase/*` | `landing-page.spec.ts` (16 tests) | Prod | Pass |
| F-005 | Component naming follows `ghl-[entity]-[type]` pattern | 1 | `registry.json` | `registry-validation.test.ts` | Prod | Pass |
| F-006 | CI/CD pipeline with lint, typecheck, tests, build | 1 | `.github/workflows/ci.yml` | Self-verifying | Prod | Pass |

## RTM: OAuth & Authentication

| ID | Requirement | Phase | Implementation | Test Coverage | Deploy | Security |
|----|-------------|-------|---------------|--------------|--------|----------|
| A-001 | Context provider for GHL authentication | 1 | `registry/new-york/auth/ghl-provider.tsx` | `ghl-provider.stories.tsx` | Prod | **CRIT-1**: `clientSecret` prop risk |
| A-002 | OAuth connect button initiating flow | 1 | `registry/new-york/auth/ghl-connect-button.tsx` | `ghl-connect-button.stories.tsx` | Prod | Pass |
| A-003 | OAuth callback handler (code exchange) | 1 | `registry/new-york/auth/ghl-oauth-callback.tsx` | None | Prod | Pass |
| A-004 | Location switcher for agency accounts | 1 | `registry/new-york/auth/ghl-location-switcher.tsx` | None | Prod | Pass |
| A-005 | `useGHL()` hook for context access | 1 | `hooks/use-ghl.ts` | None | Prod | Pass |
| A-006 | `useGHLAuth()` hook for OAuth flow | 1 | `hooks/use-ghl-auth.ts` | None | Prod | Pass (CSRF state param) |
| A-007 | `useGHLQuery()` generic data hook | 1 | `hooks/use-ghl-query.ts` | None | Prod | Pass |
| A-008 | `useGHLMutation()` generic mutation hook | 1 | `hooks/use-ghl-mutation.ts` | None | Prod | Pass |

## RTM: Contacts

| ID | Requirement | Phase | Implementation | Test Coverage | Deploy | Security |
|----|-------------|-------|---------------|--------------|--------|----------|
| C-001 | Contact display card with name, email, phone, tags | 2 | `registry/new-york/contacts/ghl-contact-card.tsx` | `ghl-contact-card.test.tsx` (9 tests), `stories` | Prod | Pass |
| C-002 | Contact create/edit form with validation | 2 | `registry/new-york/contacts/ghl-contact-form.tsx` | None | Prod | Pass (Zod validation) |
| C-003 | Scrollable contact list with pagination | 2 | `registry/new-york/contacts/ghl-contact-list.tsx` | None | Prod | Pass |
| C-004 | Typeahead contact search | 2 | `registry/new-york/contacts/ghl-contact-search.tsx` | None | Prod | Pass |
| C-005 | Modal contact picker (single/multi) | 2 | `registry/new-york/contacts/ghl-contact-picker.tsx` | None | Prod | Pass |
| C-006 | Tag manager with autocomplete | 2 | `registry/new-york/contacts/ghl-tag-manager.tsx` | None | Prod | Pass |
| C-007 | Contact CRUD hooks | 2 | `hooks/use-ghl-contact*.ts` (4 files) | None | Prod | Pass |

## RTM: Calendars & Booking

| ID | Requirement | Phase | Implementation | Test Coverage | Deploy | Security |
|----|-------------|-------|---------------|--------------|--------|----------|
| K-001 | Time slot grid grouped by time of day | 3 | `registry/new-york/calendars/ghl-time-slot-grid.tsx` | `stories` | Prod | Pass |
| K-002 | Availability picker (date + time) | 3 | `registry/new-york/calendars/ghl-availability-picker.tsx` | None | Prod | Pass |
| K-003 | Calendar selector dropdown | 3 | `registry/new-york/calendars/ghl-calendar-select.tsx` | None | Prod | Pass |
| K-004 | Appointment display card | 3 | `registry/new-york/calendars/ghl-appointment-card.tsx` | `stories` | Prod | Pass |
| K-005 | Appointment list grouped by date | 3 | `registry/new-york/calendars/ghl-appointment-list.tsx` | None | Prod | Pass |
| K-006 | Full booking form (calendar + availability + contact) | 3 | `registry/new-york/calendars/ghl-booking-form.tsx` | None | Prod | Pass (Zod validation) |
| K-007 | Calendar/appointment hooks | 3 | `hooks/use-ghl-calendar*.ts`, `hooks/use-ghl-a*.ts` (7 files) | None | Prod | Pass |

## RTM: Opportunities & Pipeline

| ID | Requirement | Phase | Implementation | Test Coverage | Deploy | Security |
|----|-------------|-------|---------------|--------------|--------|----------|
| O-001 | Pipeline selector dropdown | 4 | `registry/new-york/opportunities/ghl-pipeline-select.tsx` | None | Prod | Pass |
| O-002 | Opportunity display card | 4 | `registry/new-york/opportunities/ghl-opportunity-card.tsx` | `stories` | Prod | Pass |
| O-003 | Stage selector (move opportunity) | 4 | `registry/new-york/opportunities/ghl-stage-selector.tsx` | None | Prod | Pass |
| O-004 | Opportunity create/edit form | 4 | `registry/new-york/opportunities/ghl-opportunity-form.tsx` | None | Prod | Pass (Zod validation) |
| O-005 | Stage column (kanban column) | 4 | `registry/new-york/opportunities/ghl-stage-column.tsx` | None | Prod | Pass |
| O-006 | Opportunity list with search/filter | 4 | `registry/new-york/opportunities/ghl-opportunity-list.tsx` | None | Prod | Pass |
| O-007 | Full pipeline kanban board | 4 | `registry/new-york/opportunities/ghl-pipeline-board.tsx` | None | Prod | Pass |
| O-008 | Opportunity/pipeline hooks | 4 | `hooks/use-ghl-opportunity*.ts`, `hooks/use-ghl-pipeline*.ts` (7 files) | None | Prod | Pass |

## RTM: Conversations & Messaging

| ID | Requirement | Phase | Implementation | Test Coverage | Deploy | Security |
|----|-------------|-------|---------------|--------------|--------|----------|
| V-001 | Channel icon (SMS/Email/WhatsApp/etc.) | 5 | `registry/new-york/conversations/ghl-channel-icon.tsx` | `stories` | Prod | Pass |
| V-002 | Message bubble with status indicators | 5 | `registry/new-york/conversations/ghl-message-bubble.tsx` | `stories` | Prod | Pass |
| V-003 | Channel selector dropdown | 5 | `registry/new-york/conversations/ghl-channel-selector.tsx` | None | Prod | Pass |
| V-004 | Conversation header with contact info | 5 | `registry/new-york/conversations/ghl-conversation-header.tsx` | None | Prod | Pass |
| V-005 | Message composer with channel selection | 5 | `registry/new-york/conversations/ghl-message-composer.tsx` | None | Prod | Pass |
| V-006 | Conversation thread (scrollable) | 5 | `registry/new-york/conversations/ghl-conversation-thread.tsx` | None | Prod | Pass |
| V-007 | Conversation inbox list | 5 | `registry/new-york/conversations/ghl-conversation-list.tsx` | None | Prod | Pass |
| V-008 | Conversation/messaging hooks | 5 | `hooks/use-ghl-conversation*.ts`, `hooks/use-ghl-messages.ts`, `hooks/use-ghl-send-message.ts` (4 files) | None | Prod | Pass |

## RTM: Webhooks & Server

| ID | Requirement | Phase | Implementation | Test Coverage | Deploy | Security |
|----|-------------|-------|---------------|--------------|--------|----------|
| W-001 | RSA-SHA256 webhook signature verification | 1 | `registry/new-york/server/verify-signature.ts` | `verify-signature.test.ts` (5 tests) | Prod | Pass |
| W-002 | Webhook handler with event routing | 1 | `registry/new-york/server/webhook-handler.ts` | `webhook-handler.test.ts` (7 tests) | Prod | **MED-1**: No Zod validation |
| W-003 | Webhook deduplication | 1 | `registry/new-york/server/webhook-handler.ts` | `webhook-handler.test.ts` | Prod | **HIGH-2**: In-memory only |
| W-004 | GHL constants (public key, URLs, headers) | 1 | `registry/new-york/server/constants.ts` | Implicitly tested | Prod | Pass |
| W-005 | TypeScript type definitions for all GHL entities | 1 | `registry/new-york/server/types/*.ts` (7 files) | Type-checked at build | Prod | Pass |

## RTM: Non-functional / Cross-cutting

| ID | Requirement | Phase | Implementation | Test Coverage | Deploy | Security |
|----|-------------|-------|---------------|--------------|--------|----------|
| N-001 | Accessibility compliance | - | All components use shadcn/ui (ARIA built-in) | `accessibility.spec.ts` (7 tests) | Prod | Pass |
| N-002 | Mobile responsiveness | - | Tailwind responsive classes | `landing-page.spec.ts` (mobile test) | Prod | Pass |
| N-003 | Environment variable validation | - | `scripts/validate-env.ts` | Self-verifying script | N/A | Pass |
| N-004 | CI/CD pipeline | - | `.github/workflows/ci.yml` | Self-verifying | Prod | Pass |

---

## Gap Analysis

### Requirements with no implementation (from Roadmap)

| Roadmap Item | Phase | Priority | Status |
|--------------|-------|----------|--------|
| `<GHLErrorBoundary>` | 1 | P1 | Not started |
| `<GHLConnectionStatus>` | 1 | P2 | Not started |
| `useGHLContactDelete` | 2 | P1 | Not started |
| `useGHLContactTags` | 2 | P1 | Not started |
| `useGHLContactNotes` | 2 | P1 | Not started |
| `<GHLCalendarView>` | 3 | P1 | Not started |
| `<GHLAppointmentReschedule>` | 3 | P1 | Not started |
| `<GHLStageIndicator>` | 4 | P1 | Not started |
| `<GHLPipelineStats>` | 4 | P2 | Not started |
| All Phase 6 (Campaigns) | 6 | P1 | Not started |
| All Phase 7 (Composites) | 7 | P1-P2 | Not started |

### Implementations with no test coverage

**28 components/hooks have no unit tests.** The most critical gaps:

1. **`ghl-contact-form`** - Complex Zod validation, needs form submission tests
2. **`ghl-booking-form`** - Multi-step booking flow with calendar integration
3. **`ghl-opportunity-form`** - Pipeline/stage selection with validation
4. **`ghl-provider`** - Core auth context, needs initialization tests
5. All 22 entity-specific hooks

### Implementations beyond roadmap scope (not in original requirements)

| Component | Notes |
|-----------|-------|
| `ghl-contact-picker` | Not in Phase 2 roadmap but valuable |
| `ghl-stage-column` | Not separately listed but part of pipeline board |
| `ghl-opportunity-list` | Listed as P1 in roadmap, implemented |
| `ghl-conversation-header` | Listed as P1 in roadmap, implemented |

---

## Template for Future Development

For every new feature going forward, fill in this row before starting implementation:

```
| ID | Requirement | Phase | Implementation | Test Coverage | Deploy | Security |
|----|-------------|-------|---------------|--------------|--------|----------|
| XX-XXX | [What it does] | [Phase] | [Files] | [Test files] | [Env] | [Status] |
```

**Process:**
1. Define the requirement and add it to this matrix
2. Implement the feature in the corresponding files
3. Write unit tests and/or E2E tests
4. Verify deployment to preview environment
5. Run security checklist
6. Update this matrix with test and deployment references
