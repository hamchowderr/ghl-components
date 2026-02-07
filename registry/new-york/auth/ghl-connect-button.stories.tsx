import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { GHLConnectButton } from "./ghl-connect-button"
import { GHLProvider } from "./ghl-provider"

const meta: Meta<typeof GHLConnectButton> = {
  title: "Auth/GHLConnectButton",
  component: GHLConnectButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GHLProvider
        clientId="demo-client-id"
        redirectUri="https://example.com/callback"
      >
        <Story />
      </GHLProvider>
    ),
  ],
  argTypes: {
    scopes: {
      control: "object",
      description: "OAuth scopes to request from GoHighLevel",
    },
    onSuccess: { action: "success" },
    onError: { action: "error" },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
  },
}
export default meta

type Story = StoryObj<typeof GHLConnectButton>

export const Default: Story = {
  args: {
    scopes: ["contacts.readonly", "calendars.readonly"],
    children: "Connect to GoHighLevel",
  },
}

export const CustomText: Story = {
  args: {
    scopes: ["contacts.readonly", "contacts.write"],
    children: "Link Your GHL Account",
  },
}

export const FullScopes: Story = {
  args: {
    scopes: [
      "contacts.readonly",
      "contacts.write",
      "calendars.readonly",
      "calendars.write",
      "opportunities.readonly",
      "opportunities.write",
    ],
    children: "Connect with Full Access",
  },
}

export const Disabled: Story = {
  args: {
    scopes: ["contacts.readonly"],
    children: "Connect to GoHighLevel",
    disabled: true,
  },
}

export const ReadOnlyScopes: Story = {
  args: {
    scopes: [
      "contacts.readonly",
      "calendars.readonly",
      "opportunities.readonly",
    ],
    children: "Connect (Read Only)",
  },
}

export const CalendarOnly: Story = {
  args: {
    scopes: ["calendars.readonly", "calendars.write"],
    children: "Connect Calendar",
  },
}
