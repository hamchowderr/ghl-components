import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Search, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Input } from "./input"
import { Label } from "./label"

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url", "search"],
      description: "The input type",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    type: "text",
    placeholder: "Enter text...",
  },
}

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "john@example.com",
  },
}

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
}

export const Search: Story = {
  args: {
    type: "search",
    placeholder: "Search...",
  },
}

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "0",
  },
}

export const Phone: Story = {
  args: {
    type: "tel",
    placeholder: "+1 (555) 123-4567",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Disabled input",
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="m@example.com" />
    </div>
  ),
}

export const WithHelperText: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="m@example.com" />
      <p className="text-sm text-muted-foreground">
        We&apos;ll never share your email.
      </p>
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="email" className="text-destructive">
        Email
      </Label>
      <Input
        id="email"
        type="email"
        placeholder="m@example.com"
        className="border-destructive focus-visible:ring-destructive"
        aria-invalid="true"
      />
      <p className="text-sm text-destructive">
        Please enter a valid email address.
      </p>
    </div>
  ),
}

export const File: Story = {
  args: {
    type: "file",
  },
}

// Password with toggle visibility
const PasswordWithToggle = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="grid gap-2">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}

export const PasswordToggle: Story = {
  render: () => <PasswordWithToggle />,
}

// Form example
export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="John Doe" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="form-email">Email</Label>
        <Input id="form-email" type="email" placeholder="john@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="form-phone">Phone</Label>
        <Input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />
      </div>
    </div>
  ),
}
