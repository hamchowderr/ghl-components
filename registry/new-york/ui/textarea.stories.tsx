import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Textarea } from "./textarea"
import { Label } from "./label"

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Whether the textarea is disabled",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    rows: {
      control: { type: "number", min: 1, max: 20 },
      description: "Number of visible text lines",
    },
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

type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="message">Your Message</Label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
  ),
}

export const WithHelperText: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea
        id="bio"
        placeholder="Tell us a little bit about yourself"
        rows={4}
      />
      <p className="text-sm text-muted-foreground">
        You can use up to 500 characters.
      </p>
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="notes" className="text-destructive">
        Notes
      </Label>
      <Textarea
        id="notes"
        placeholder="Enter your notes..."
        className="border-destructive focus-visible:ring-destructive"
        aria-invalid="true"
      />
      <p className="text-sm text-destructive">This field is required.</p>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "This textarea is disabled",
  },
}

export const LargeRows: Story = {
  args: {
    placeholder: "A larger textarea...",
    rows: 8,
  },
}

export const SmallRows: Story = {
  args: {
    placeholder: "A smaller textarea...",
    rows: 2,
  },
}

export const WithDefaultValue: Story = {
  args: {
    defaultValue:
      "This is some default content that appears in the textarea when it loads.",
    rows: 4,
  },
}

export const CharacterCount: Story = {
  render: () => {
    const maxLength = 200
    return (
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your request..."
          maxLength={maxLength}
          rows={4}
        />
        <p className="text-sm text-muted-foreground text-right">0 / {maxLength}</p>
      </div>
    )
  },
}

// Email compose example
export const EmailCompose: Story = {
  render: () => (
    <div className="space-y-4 border rounded-lg p-4">
      <div className="grid gap-2">
        <Label htmlFor="subject">Subject</Label>
        <input
          id="subject"
          type="text"
          placeholder="Enter subject..."
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="body">Message</Label>
        <Textarea
          id="body"
          placeholder="Write your email message here..."
          rows={8}
        />
      </div>
    </div>
  ),
}
