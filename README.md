# GHL Components

A [shadcn/ui](https://ui.shadcn.com) component registry for [GoHighLevel](https://www.gohighlevel.com) integrations.

> Built for "vibe coders" who want to connect their apps to GHL without wrestling with OAuth flows, webhook signatures, and API complexity.

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
pnpm install
pnpm dev
pnpm build:registry
```

## License

MIT © Chowderr / Otaku Solutions
