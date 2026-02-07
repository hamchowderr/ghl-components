# GHL Components

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)

A [shadcn/ui](https://ui.shadcn.com) component registry for [GoHighLevel](https://www.gohighlevel.com) integrations.

> Built for "vibe coders" who want to connect their apps to GHL without wrestling with OAuth flows, webhook signatures, and API complexity.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Components](#components)
  - [Auth](#auth)
  - [Contacts](#contacts)
  - [Calendars](#calendars)
  - [Server](#server)
- [Webhook Handling](#webhook-handling)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Features

- **OAuth 2.0 Authentication** - Complete authentication flow with GHL including token refresh and session management
- **RSA-SHA256 Webhook Verification** - Secure webhook signature verification using GHL's public key
- **Type-safe TypeScript Definitions** - Comprehensive types for all GHL entities (contacts, opportunities, calendars, conversations)
- **React Hooks for API Operations** - Custom hooks for data fetching and mutations
- **shadcn/ui Component Patterns** - Consistent, accessible, and customizable components
- **Copy-paste Installation** - Install components directly into your project via shadcn CLI

## Installation

```bash
npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-provider.json
npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-contact-form.json
npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-booking-form.json
```

## Quick Start

### 1. Set up the Provider

```tsx
import { GHLProvider } from "@/components/ghl/ghl-provider"

export default function App({ children }) {
  return (
    <GHLProvider
      clientId={process.env.NEXT_PUBLIC_GHL_CLIENT_ID!}
      redirectUri={process.env.NEXT_PUBLIC_GHL_REDIRECT_URI!}
    >
      {children}
    </GHLProvider>
  )
}
```

### 2. Add the Connect Button

```tsx
import { GHLConnectButton } from "@/components/ghl/ghl-connect-button"

export function ConnectPage() {
  return <GHLConnectButton />
}
```

### 3. Use Components

```tsx
import { GHLContactForm } from "@/components/ghl/ghl-contact-form"
import { GHLBookingForm } from "@/components/ghl/ghl-booking-form"

export function LeadCapturePage() {
  return (
    <div>
      <GHLContactForm onSuccess={(contact) => console.log("Created:", contact)} />
      <GHLBookingForm calendarId="your-calendar-id" />
    </div>
  )
}
```

## Components

### Auth

| Component | Description | Install |
|-----------|-------------|---------|
| `ghl-provider` | Context provider for GHL authentication | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-provider.json` |
| `ghl-connect-button` | OAuth connect button | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-connect-button.json` |
| `ghl-oauth-callback` | OAuth callback handler | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-oauth-callback.json` |
| `ghl-location-switcher` | Agency location switcher | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-location-switcher.json` |

### Contacts

| Component | Description | Install |
|-----------|-------------|---------|
| `ghl-contact-card` | Contact display card | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-contact-card.json` |
| `ghl-contact-form` | Create/edit contact form | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-contact-form.json` |
| `ghl-contact-list` | Scrollable contact list | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-contact-list.json` |
| `ghl-contact-search` | Typeahead contact search | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-contact-search.json` |
| `ghl-contact-picker` | Modal contact selector | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-contact-picker.json` |
| `ghl-tag-manager` | Tag management component | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-tag-manager.json` |

### Calendars

| Component | Description | Install |
|-----------|-------------|---------|
| `ghl-time-slot-grid` | Time slot grid display | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-time-slot-grid.json` |
| `ghl-availability-picker` | Date + time slot picker | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-availability-picker.json` |

### Server

| Component | Description | Install |
|-----------|-------------|---------|
| `ghl-webhook-handler` | Webhook handler with RSA-SHA256 signature verification | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-webhook-handler.json` |
| `ghl-types` | TypeScript type definitions for all GHL entities | `npx shadcn@latest add https://ghl-components.vercel.app/r/ghl-types.json` |

## Webhook Handling

```ts
// app/api/webhooks/ghl/route.ts
import { withGHLWebhook } from "@/lib/ghl/webhook-handler"

export const POST = withGHLWebhook({
  onContactCreate: async (data) => {
    console.log("New contact:", data)
  },
  onAppointmentCreate: async (data) => {
    console.log("New appointment:", data)
  },
  onOpportunityStageUpdate: async (data) => {
    console.log("Stage changed:", data)
  },
})
```

## Environment Variables

```env
NEXT_PUBLIC_GHL_CLIENT_ID=your-client-id
GHL_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_GHL_REDIRECT_URI=https://your-app.com/api/auth/callback/ghl
GHL_LOCATION_ID=your-location-id
```

## Development

```bash
npm install
npm run dev
npm run build:registry
```

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository** and clone it locally
2. **Create your component** in `registry/new-york/[category]/` following the naming convention `ghl-[entity]-[type].tsx`
3. **Add your component to `registry.json`** with the appropriate metadata, dependencies, and file mappings
4. **Build the registry** to generate distribution files:
   ```bash
   npm run build:registry
   ```
5. **Test your component** locally to ensure it installs correctly
6. **Submit a pull request** with a clear description of your changes

Please ensure your components follow the existing patterns and include proper TypeScript types.

## License

MIT - Chowderr / Otaku Solutions
