import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { GHLOpportunityCard } from "./ghl-opportunity-card"

const mockOpportunity = {
  id: "opp-123",
  name: "Enterprise Deal - Acme Corp",
  pipelineId: "pipeline-1",
  pipelineStageId: "stage-3",
  status: "open" as const,
  contactId: "contact-456",
  monetaryValue: 50000,
  assignedTo: "user-789",
  source: "Website",
  dateAdded: "2024-01-15T10:30:00Z",
  dateUpdated: "2024-01-20T14:00:00Z",
}

const meta: Meta<typeof GHLOpportunityCard> = {
  title: "Opportunities/GHLOpportunityCard",
  component: GHLOpportunityCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    showValue: {
      control: "boolean",
      description: "Whether to display the monetary value",
    },
    showStatus: {
      control: "boolean",
      description: "Whether to display the status badge",
    },
    onEdit: { action: "edit clicked" },
    onDelete: { action: "delete clicked" },
    onMoveStage: { action: "move stage clicked" },
    onClick: { action: "card clicked" },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof GHLOpportunityCard>

export const Default: Story = {
  args: {
    opportunity: mockOpportunity,
    stageName: "Qualified",
    contactName: "John Doe",
    showValue: true,
    showStatus: true,
  },
}

export const Won: Story = {
  args: {
    opportunity: {
      ...mockOpportunity,
      status: "won",
      name: "Closed Deal - Big Corp",
      monetaryValue: 125000,
    },
    stageName: "Closed Won",
    contactName: "Sarah Johnson",
    showValue: true,
    showStatus: true,
  },
}

export const Lost: Story = {
  args: {
    opportunity: {
      ...mockOpportunity,
      status: "lost",
      name: "Lost Opportunity - Tech Inc",
      monetaryValue: 75000,
    },
    stageName: "Closed Lost",
    contactName: "Mike Wilson",
    showValue: true,
    showStatus: true,
  },
}

export const Abandoned: Story = {
  args: {
    opportunity: {
      ...mockOpportunity,
      status: "abandoned",
      name: "Stale Lead - Old Company",
      monetaryValue: 10000,
    },
    stageName: "No Response",
    contactName: "Unknown Contact",
    showValue: true,
    showStatus: true,
  },
}

export const WithActions: Story = {
  args: {
    opportunity: mockOpportunity,
    stageName: "Discovery",
    contactName: "Jane Smith",
    showValue: true,
    showStatus: true,
    onEdit: (id) => console.log("Edit:", id),
    onDelete: (id) => console.log("Delete:", id),
    onMoveStage: (id) => console.log("Move stage:", id),
  },
}

export const Clickable: Story = {
  args: {
    opportunity: mockOpportunity,
    stageName: "Proposal",
    contactName: "Alex Brown",
    showValue: true,
    showStatus: true,
    onClick: (id) => console.log("Clicked:", id),
  },
}

export const NoValue: Story = {
  args: {
    opportunity: {
      ...mockOpportunity,
      monetaryValue: undefined,
    },
    stageName: "Initial Contact",
    contactName: "Chris Davis",
    showValue: true,
    showStatus: true,
  },
}

export const HighValue: Story = {
  args: {
    opportunity: {
      ...mockOpportunity,
      name: "Major Enterprise Contract",
      monetaryValue: 1000000,
    },
    stageName: "Negotiation",
    contactName: "Enterprise Team",
    showValue: true,
    showStatus: true,
  },
}

export const WithSource: Story = {
  args: {
    opportunity: {
      ...mockOpportunity,
      source: "LinkedIn Campaign",
    },
    stageName: "Demo Scheduled",
    contactName: "Marketing Lead",
    showValue: true,
    showStatus: true,
  },
}

export const MinimalDisplay: Story = {
  args: {
    opportunity: mockOpportunity,
    showValue: false,
    showStatus: false,
  },
}
