import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { GHLMessageBubble } from "./ghl-message-bubble"
import type { GHLMessage } from "@/registry/new-york/server/types/conversation"

const baseMessage: GHLMessage = {
  id: "msg-123",
  locationId: "loc-1",
  conversationId: "conv-1",
  contactId: "contact-1",
  type: "SMS",
  direction: "inbound",
  status: "delivered",
  body: "Hello! I'm interested in learning more about your services.",
  contentType: "text/plain",
  dateAdded: new Date().toISOString(),
}

const meta: Meta<typeof GHLMessageBubble> = {
  title: "Conversations/GHLMessageBubble",
  component: GHLMessageBubble,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    showChannelIcon: {
      control: "boolean",
      description: "Whether to show the channel icon",
    },
    showStatus: {
      control: "boolean",
      description: "Whether to show the message status indicator",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] p-4">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof GHLMessageBubble>

export const InboundSMS: Story = {
  args: {
    message: baseMessage,
    showChannelIcon: true,
    showStatus: true,
  },
}

export const OutboundSMS: Story = {
  args: {
    message: {
      ...baseMessage,
      direction: "outbound",
      body: "Thank you for reaching out! I'd be happy to help. When would be a good time for a call?",
      status: "delivered",
    },
    showChannelIcon: true,
    showStatus: true,
  },
}

export const EmailMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      type: "Email",
      direction: "outbound",
      body: "Dear valued customer,\n\nThank you for your interest in our services. I wanted to follow up on our previous conversation.\n\nPlease let me know if you have any questions.\n\nBest regards,\nSales Team",
      status: "opened",
      meta: {
        email: {
          subject: "Follow-up on Your Inquiry",
          from: "sales@company.com",
          to: ["customer@example.com"],
        },
      },
    },
    showChannelIcon: true,
    showStatus: true,
  },
}

export const WhatsAppMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      type: "WhatsApp",
      body: "Hi! I saw your ad on Facebook. Can you tell me more about pricing?",
    },
    showChannelIcon: true,
    showStatus: true,
  },
}

export const FacebookMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      type: "FB",
      body: "Just sent you a message on your page. Looking forward to hearing back!",
    },
    showChannelIcon: true,
    showStatus: true,
  },
}

export const InstagramMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      type: "IG",
      body: "Love your products! Do you ship internationally?",
    },
    showChannelIcon: true,
    showStatus: true,
  },
}

export const PendingMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      direction: "outbound",
      status: "pending",
      body: "This message is being sent...",
    },
    showChannelIcon: true,
    showStatus: true,
  },
}

export const SentMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      direction: "outbound",
      status: "sent",
      body: "Message has been sent",
    },
    showChannelIcon: true,
    showStatus: true,
  },
}

export const FailedMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      direction: "outbound",
      status: "failed",
      body: "This message failed to send",
    },
    showChannelIcon: true,
    showStatus: true,
  },
}

export const ReadMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      direction: "outbound",
      status: "read",
      body: "This message has been read by the recipient",
    },
    showChannelIcon: true,
    showStatus: true,
  },
}

export const WithAttachment: Story = {
  args: {
    message: {
      ...baseMessage,
      body: "Please see the attached document for more details.",
      attachments: [
        {
          type: "application/pdf",
          url: "https://example.com/document.pdf",
          name: "Proposal.pdf",
          size: 245000,
        },
      ],
    },
    showChannelIcon: true,
    showStatus: true,
  },
}

export const MultipleAttachments: Story = {
  args: {
    message: {
      ...baseMessage,
      direction: "outbound",
      body: "Here are the files you requested.",
      attachments: [
        {
          type: "application/pdf",
          url: "https://example.com/contract.pdf",
          name: "Contract.pdf",
        },
        {
          type: "image/png",
          url: "https://example.com/diagram.png",
          name: "Architecture Diagram.png",
        },
        {
          type: "application/xlsx",
          url: "https://example.com/pricing.xlsx",
          name: "Pricing Sheet.xlsx",
        },
      ],
    },
    showChannelIcon: true,
    showStatus: true,
  },
}

export const LongMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      body: `I wanted to reach out regarding your recent inquiry about our enterprise solutions.

We offer a comprehensive suite of tools designed specifically for businesses of your size. Our platform includes:

- Customer relationship management
- Marketing automation
- Sales pipeline tracking
- Analytics and reporting
- Integration with popular tools

I'd love to schedule a demo to show you how these features can benefit your organization. Would next Tuesday or Wednesday work for you?

Looking forward to hearing from you!`,
    },
    showChannelIcon: true,
    showStatus: true,
  },
}

export const HTMLEmail: Story = {
  args: {
    message: {
      ...baseMessage,
      type: "Email",
      contentType: "text/html",
      body: "<p>Hello,</p><p>Thank you for your <strong>interest</strong> in our services!</p><p>Visit our <a href='https://example.com'>website</a> for more information.</p>",
      meta: {
        email: {
          subject: "Welcome to Our Service",
        },
      },
    },
    showChannelIcon: true,
    showStatus: true,
  },
}

export const NoChannelIcon: Story = {
  args: {
    message: baseMessage,
    showChannelIcon: false,
    showStatus: true,
  },
}

export const NoStatus: Story = {
  args: {
    message: {
      ...baseMessage,
      direction: "outbound",
    },
    showChannelIcon: true,
    showStatus: false,
  },
}

// Conversation thread example
export const ConversationThread: Story = {
  render: () => (
    <div className="space-y-3">
      <GHLMessageBubble
        message={{
          ...baseMessage,
          body: "Hi, I'm interested in your services!",
        }}
      />
      <GHLMessageBubble
        message={{
          ...baseMessage,
          id: "msg-2",
          direction: "outbound",
          status: "delivered",
          body: "Hello! Thank you for reaching out. How can I help you today?",
          dateAdded: new Date(Date.now() - 300000).toISOString(),
        }}
      />
      <GHLMessageBubble
        message={{
          ...baseMessage,
          id: "msg-3",
          body: "I'd like to know more about your pricing plans.",
          dateAdded: new Date(Date.now() - 120000).toISOString(),
        }}
      />
      <GHLMessageBubble
        message={{
          ...baseMessage,
          id: "msg-4",
          direction: "outbound",
          status: "read",
          body: "Of course! We have three tiers: Starter ($29/mo), Professional ($79/mo), and Enterprise (custom pricing). Which one interests you?",
          dateAdded: new Date(Date.now() - 60000).toISOString(),
        }}
      />
    </div>
  ),
}
