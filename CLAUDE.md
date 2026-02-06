# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GHL Components** is a shadcn/ui-based component registry for GoHighLevel (GHL) integrations. It enables developers to build GHL-connected applications without wrestling with OAuth flows, webhook signatures, and API complexity.

Components are distributed using shadcn's registry pattern:
```bash
npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-provider.json
npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-contact-form.json
```

## Development Commands

### Building
```bash
npm run dev                # Start Next.js dev server
npm run build              # Build registry + Next.js app (shadcn build && next build)
npm run build:registry     # Build only the shadcn registry
npm run lint               # Run ESLint
```

### Testing Registry Components
After building the registry, components are available at:
```
https://ghl-components.vercel.app/r/[component-name].json
```

## Architecture

### Registry Distribution System

This project uses **shadcn's registry pattern** for component distribution:

1. **Registry Declaration** (`registry.json`): Declares all components with metadata, dependencies, and file mappings
2. **Component Files** (`registry/new-york/[category]/`): Source files organized by GHL entity (auth, contacts, calendars, opportunities, conversations, campaigns)
3. **Installation**: Users run `npx shadcn@latest add [URL]` and components copy into their project with dependencies

**Naming Convention**: All components follow `ghl-[entity]-[type]` pattern (e.g., `ghl-contact-form`, `ghl-booking-form`, `ghl-pipeline-board`)

### Server-Side Architecture

GoHighLevel integrations require server-side utilities for authentication and webhooks. These live in `registry/new-york/server/`:

#### Webhook Handling (`webhook-handler.ts`)

GHL webhooks use **RSA-SHA256 signature verification**, NOT HMAC. Key implementation details:

```typescript
import { withGHLWebhook } from "@/lib/ghl/webhook-handler"

export const POST = withGHLWebhook({
  onContactCreate: async (data) => {
    // Handler logic
  }
})
```

**Critical patterns**:
- **Immediate response**: Handler returns 200 immediately, processes webhook asynchronously
- **Duplicate prevention**: Uses Set-based deduplication via `webhookId`
- **RSA verification**: Uses GHL's public key (in `constants.ts`) to verify signatures
- **Type-safe routing**: Event type determines which handler to call

#### Signature Verification (`verify-signature.ts`)

Uses Node's `crypto.createVerify("SHA256")` with GHL's RSA public key. This is different from typical HMAC-based webhook verification.

#### Type System (`types/`)

Comprehensive TypeScript types for all GHL entities:
- `contact.ts` - Contact, Tag, Note, Task, custom fields
- `opportunity.ts` - Pipeline, Stage, Opportunity
- `calendar.ts` - Calendar, Appointment, availability slots
- `conversation.ts` - Message, Thread, Conversation
- `webhook.ts` - 20+ webhook event types with typed payloads
- `oauth.ts` - OAuth tokens and configuration

### Path Aliases

From `tsconfig.json`:
- `@/*` → Project root
- `@/components` → `components/`
- `@/lib` → `lib/`
- `@/hooks` → `hooks/`

### Component Organization

```
registry/new-york/
├── auth/          # OAuth components (ghl-provider, ghl-connect-button)
├── contacts/      # Contact management (forms, lists, cards)
├── calendars/     # Booking and appointments
├── opportunities/ # Pipeline and sales management
├── conversations/ # Messaging (SMS, email, etc.)
├── campaigns/     # Marketing automation
└── server/        # Server-side utilities (webhooks, types, client)
```

## Implementation Status

**Completed**:
- Registry infrastructure (`registry.json`, `components.json`)
- Base shadcn/ui primitives (button, card, input, label, textarea)
- Server utilities (webhook handler, signature verification, types)
- Type definitions for all GHL entities
- Landing page

**In Progress** (declared but not implemented):
- OAuth flow components
- Contact management components
- Calendar/booking components
- Opportunity/pipeline components
- Messaging components

See `docs/ROADMAP.md` for the 7-phase development plan.

## GHL API Integration

### Base Configuration
```typescript
Base URL: https://services.leadconnectorhq.com
Auth Header: Authorization: Bearer {token}
Version Header: Version: 2021-07-28
```

### Rate Limits
- 200,000 requests/day per app per location
- 100 requests/10 seconds burst limit
- Monitor via `X-RateLimit-*` headers

### Authentication
OAuth 2.0 is the primary auth method. The project will support Private Integration Tokens as a simpler alternative for basic use cases.

### Webhook Events
GHL sends webhooks for 20+ event types including:
- Contact: Create, Update, Delete, DndUpdate, TagUpdate
- Opportunity: Create, Update, Delete, StageUpdate, StatusUpdate, MonetaryValueUpdate
- Appointment: Create, Update, Delete
- Message: InboundMessage, OutboundMessage
- Conversation: UnreadUpdate

Full event reference in `docs/ROADMAP.md` Appendix B.

## Adding New Components

When adding new registry components:

1. **Create component file** in `registry/new-york/[category]/[component-name].tsx`
2. **Add entry to `registry.json`**:
   ```json
   {
     "name": "ghl-component-name",
     "type": "registry:component",
     "dependencies": ["lucide-react"],
     "registryDependencies": ["button", "card"],
     "files": [{"path": "registry/new-york/category/component-name.tsx"}]
   }
   ```
3. **Run `npm run build:registry`** to generate distribution files
4. **Test installation** locally before deploying

## Environment Variables

Required for GHL integration:
```env
NEXT_PUBLIC_GHL_CLIENT_ID=your-client-id
GHL_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_GHL_REDIRECT_URI=https://your-app.com/api/auth/callback/ghl
GHL_LOCATION_ID=your-location-id
```

## Key Technical Decisions

### Why RSA instead of HMAC for webhooks?
GHL uses RSA-SHA256 signatures for webhook verification. The public key is embedded in `constants.ts` and verified using Node's crypto module.

### Why async webhook processing?
GHL webhooks expect immediate 200 responses. Processing in the background prevents timeouts while allowing complex operations (database writes, API calls, etc.).

### Why shadcn registry pattern?
Allows developers to copy components into their projects (not install as npm package), enabling customization while maintaining type safety and dependency management.

### React Server Components
Components.json sets `"rsc": true`, enabling React Server Component patterns for Next.js App Router compatibility.
