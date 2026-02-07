import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { GHLChannelIcon, getChannelLabel, getAvailableChannels } from "./ghl-channel-icon"
import type { GHLMessageType } from "@/registry/new-york/server/types/conversation"

const meta: Meta<typeof GHLChannelIcon> = {
  title: "Conversations/GHLChannelIcon",
  component: GHLChannelIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    channel: {
      control: "select",
      options: ["SMS", "Email", "FB", "IG", "WhatsApp", "GMB", "Live_Chat", "Call", "Custom"],
      description: "The message channel type",
    },
    size: {
      control: { type: "range", min: 12, max: 48, step: 4 },
      description: "Size of the icon in pixels",
    },
  },
}
export default meta

type Story = StoryObj<typeof GHLChannelIcon>

export const SMS: Story = {
  args: {
    channel: "SMS",
    size: 24,
  },
}

export const Email: Story = {
  args: {
    channel: "Email",
    size: 24,
  },
}

export const Facebook: Story = {
  args: {
    channel: "FB",
    size: 24,
  },
}

export const Instagram: Story = {
  args: {
    channel: "IG",
    size: 24,
  },
}

export const WhatsApp: Story = {
  args: {
    channel: "WhatsApp",
    size: 24,
  },
}

export const GoogleBusinessMessages: Story = {
  args: {
    channel: "GMB",
    size: 24,
  },
}

export const LiveChat: Story = {
  args: {
    channel: "Live_Chat",
    size: 24,
  },
}

export const PhoneCall: Story = {
  args: {
    channel: "Call",
    size: 24,
  },
}

export const Custom: Story = {
  args: {
    channel: "Custom",
    size: 24,
  },
}

export const SmallSize: Story = {
  args: {
    channel: "SMS",
    size: 12,
  },
}

export const LargeSize: Story = {
  args: {
    channel: "SMS",
    size: 48,
  },
}

export const WithCustomClass: Story = {
  args: {
    channel: "Email",
    size: 24,
    className: "opacity-50",
  },
}

// All channels showcase
export const AllChannels: Story = {
  render: () => {
    const channels = getAvailableChannels()
    return (
      <div className="grid grid-cols-3 gap-6">
        {channels.map((channel) => (
          <div key={channel} className="flex items-center gap-3 p-3 border rounded-lg">
            <GHLChannelIcon channel={channel} size={24} />
            <span className="text-sm font-medium">{getChannelLabel(channel)}</span>
          </div>
        ))}
      </div>
    )
  },
}

// Size comparison
export const SizeComparison: Story = {
  render: () => {
    const sizes = [12, 16, 20, 24, 32, 48]
    return (
      <div className="flex items-end gap-4">
        {sizes.map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <GHLChannelIcon channel="SMS" size={size} />
            <span className="text-xs text-muted-foreground">{size}px</span>
          </div>
        ))}
      </div>
    )
  },
}

// In context - message list
export const InMessageList: Story = {
  render: () => {
    const messages = [
      { channel: "SMS" as GHLMessageType, preview: "Hey, are you available for a call?" },
      { channel: "Email" as GHLMessageType, preview: "Re: Your inquiry about our services" },
      { channel: "WhatsApp" as GHLMessageType, preview: "Thanks for getting back to me!" },
      { channel: "FB" as GHLMessageType, preview: "I saw your ad on Facebook..." },
      { channel: "IG" as GHLMessageType, preview: "Love your products!" },
    ]
    return (
      <div className="w-[400px] border rounded-lg divide-y">
        {messages.map((msg, index) => (
          <div key={index} className="flex items-center gap-3 p-4">
            <GHLChannelIcon channel={msg.channel} size={20} />
            <p className="text-sm truncate">{msg.preview}</p>
          </div>
        ))}
      </div>
    )
  },
}
