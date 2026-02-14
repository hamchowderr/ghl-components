# Section 4: Test Coverage Report

> Generated: 2026-02-14

## Test Framework Setup

| Framework | Purpose | Config |
|-----------|---------|--------|
| **Vitest** | Unit & component tests | `vitest.config.ts` |
| **Playwright** | E2E tests | `playwright.config.ts` |
| **Storybook + Vitest** | Visual component tests | `vitest.config.ts` (storybook project) |
| **Testing Library** | Component rendering | `@testing-library/react` |

---

## Test Inventory

### Unit Tests (`__tests__/`)

| Test File | Feature Tested | Tests | Coverage |
|-----------|---------------|-------|----------|
| `registry/registry-validation.test.ts` | Registry JSON structure, file existence, naming conventions, dependency references | 6 | Registry infrastructure |
| `unit/server/verify-signature.test.ts` | RSA-SHA256 signature verification, missing signatures, tampered payloads | 5 | Webhook signature verification |
| `unit/server/webhook-handler.test.ts` | Webhook routing, deduplication, signature check toggle, malformed JSON, event dispatching | 7 | Webhook handler logic |
| `components/ghl-contact-card.test.tsx` | Contact card rendering, loading states, error states, action handlers | 9 | Contact card component |
| `unit/lib/utils.test.ts` | Utility function tests | 1+ | Core utilities |

### E2E Tests (`e2e/`)

| Test File | Feature Tested | Tests | Coverage |
|-----------|---------------|-------|----------|
| `landing-page.spec.ts` | Page load, hero section, features section, component grid, tabs, footer, responsive, scroll behavior | 16 | Landing page (all sections) |
| `registry-endpoints.spec.ts` | All registry items accessible, JSON structure, 404s, CORS headers, cache headers, dependency validation | 6 | Registry API endpoints |
| `accessibility.spec.ts` | Heading hierarchy, alt text, keyboard navigation, accessible names, external link security, lang attribute | 7 | Accessibility compliance |

### Storybook Stories (Visual Tests)

| Story File | Component | Variants |
|------------|-----------|----------|
| `auth/ghl-connect-button.stories.tsx` | GHLConnectButton | Default, loading, connected states |
| `auth/ghl-provider.stories.tsx` | GHLProvider | Provider wrapper |
| `calendars/ghl-appointment-card.stories.tsx` | GHLAppointmentCard | With/without data |
| `calendars/ghl-time-slot-grid.stories.tsx` | GHLTimeSlotGrid | Morning/afternoon/evening slots |
| `contacts/ghl-contact-card.stories.tsx` | GHLContactCard | With data, with tags, loading |
| `conversations/ghl-channel-icon.stories.tsx` | GHLChannelIcon | All channel types |
| `conversations/ghl-message-bubble.stories.tsx` | GHLMessageBubble | Inbound, outbound |
| `opportunities/ghl-opportunity-card.stories.tsx` | GHLOpportunityCard | With data, stages |
| `ui/button.stories.tsx` | Button | Variants, sizes |
| `ui/card.stories.tsx` | Card | Default |
| `ui/input.stories.tsx` | Input | Default |
| `ui/textarea.stories.tsx` | Textarea | Default |

---

## Feature → Test Mapping

| Feature | Unit Tests | E2E Tests | Storybook | Gap |
|---------|-----------|-----------|-----------|-----|
| Landing page load | - | landing-page.spec.ts | - | None |
| Hero section | - | landing-page.spec.ts | - | None |
| Features section | - | landing-page.spec.ts | - | None |
| Component grid + tabs | - | landing-page.spec.ts | - | None |
| Registry endpoint serving | - | registry-endpoints.spec.ts | - | None |
| Registry JSON structure | registry-validation.test.ts | registry-endpoints.spec.ts | - | None |
| Webhook signature verification | verify-signature.test.ts | - | - | None |
| Webhook handler routing | webhook-handler.test.ts | - | - | None |
| Webhook deduplication | webhook-handler.test.ts | - | - | None |
| Contact card rendering | ghl-contact-card.test.tsx | - | contact-card.stories | None |
| Contact form | - | - | - | **Missing** |
| Contact list | - | - | - | **Missing** |
| Contact search | - | - | - | **Missing** |
| Contact picker | - | - | - | **Missing** |
| Tag manager | - | - | - | **Missing** |
| OAuth connect button | - | - | connect-button.stories | **Unit tests missing** |
| OAuth callback | - | - | - | **Missing** |
| Location switcher | - | - | - | **Missing** |
| Booking form | - | - | - | **Missing** |
| Availability picker | - | - | - | **Missing** |
| Calendar select | - | - | - | **Missing** |
| Appointment card | - | - | appointment-card.stories | **Unit tests missing** |
| Appointment list | - | - | - | **Missing** |
| Time slot grid | - | - | time-slot-grid.stories | **Unit tests missing** |
| Pipeline board | - | - | - | **Missing** |
| Opportunity card | - | - | opportunity-card.stories | **Unit tests missing** |
| Opportunity form | - | - | - | **Missing** |
| Pipeline select | - | - | - | **Missing** |
| Stage selector | - | - | - | **Missing** |
| Conversation list | - | - | - | **Missing** |
| Conversation thread | - | - | - | **Missing** |
| Message composer | - | - | - | **Missing** |
| Message bubble | - | - | message-bubble.stories | **Unit tests missing** |
| Channel icon | - | - | channel-icon.stories | **Unit tests missing** |
| Channel selector | - | - | - | **Missing** |
| Accessibility | - | accessibility.spec.ts | - | None |
| Mobile responsiveness | - | landing-page.spec.ts | - | None |

---

## Coverage Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| Features with full test coverage | 12 | 32% |
| Features with partial coverage (story only) | 8 | 22% |
| Features with no test coverage | 17 | 46% |
| Total unit tests | ~28 | - |
| Total E2E tests | 29 | - |
| Total Storybook stories | 12 files | - |

---

## Recommendations

### Immediate Priority
1. Add unit tests for `ghl-contact-form` (most complex component with Zod validation)
2. Add unit tests for `ghl-booking-form` (complex booking flow)
3. Add unit tests for `ghl-opportunity-form` (complex with pipeline selection)

### Short-term
4. Add unit tests for all components that have Storybook stories but no unit tests
5. Add E2E test for component tab filtering behavior
6. Add tests for all hooks (`use-ghl-query`, `use-ghl-mutation`)

### Long-term
7. Reach 80%+ test coverage on registry components and hooks
8. Add visual regression tests via Chromatic or Percy
9. Add integration tests that mock GHL API responses end-to-end
