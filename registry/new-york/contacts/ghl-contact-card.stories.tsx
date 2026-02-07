import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { GHLContactCard } from "./ghl-contact-card"

// Mock the useGHLContact hook
const mockContact = {
  id: "contact-123",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+15551234567",
  companyName: "Acme Corporation",
  tags: ["VIP", "Lead", "Newsletter"],
  customFields: [
    { id: "cf1", name: "Preferred Contact", value: "Email" },
    { id: "cf2", name: "Source", value: "Website" },
  ],
}

const meta: Meta<typeof GHLContactCard> = {
  title: "Contacts/GHLContactCard",
  component: GHLContactCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    showTags: {
      control: "boolean",
      description: "Whether to display contact tags",
    },
    showCustomFields: {
      control: "boolean",
      description: "Whether to display custom fields",
    },
    onEdit: { action: "edit clicked" },
    onDelete: { action: "delete clicked" },
  },
}
export default meta

type Story = StoryObj<typeof GHLContactCard>

export const Default: Story = {
  args: {
    contact: mockContact,
    showTags: true,
    showCustomFields: false,
  },
}

export const WithCustomFields: Story = {
  args: {
    contact: mockContact,
    showTags: true,
    showCustomFields: true,
  },
}

export const WithoutTags: Story = {
  args: {
    contact: {
      ...mockContact,
      tags: undefined,
    },
    showTags: true,
    showCustomFields: false,
  },
}

export const MinimalContact: Story = {
  args: {
    contact: {
      id: "contact-456",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
    },
    showTags: false,
    showCustomFields: false,
  },
}

export const WithActions: Story = {
  args: {
    contact: mockContact,
    showTags: true,
    showCustomFields: false,
    onEdit: (id) => console.log("Edit contact:", id),
    onDelete: (id) => console.log("Delete contact:", id),
  },
}

export const PhoneOnly: Story = {
  args: {
    contact: {
      id: "contact-789",
      firstName: "Bob",
      phone: "+15559876543",
    },
    showTags: false,
    showCustomFields: false,
  },
}

export const CompanyContact: Story = {
  args: {
    contact: {
      id: "contact-abc",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@bigcorp.com",
      phone: "+15551112222",
      companyName: "Big Corporation Inc.",
      tags: ["Enterprise", "Decision Maker"],
    },
    showTags: true,
    showCustomFields: false,
  },
}
