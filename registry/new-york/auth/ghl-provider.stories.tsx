import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useContext } from "react"
import { GHLProvider, GHLContext } from "./ghl-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york/ui/card"
import { Badge } from "@/components/ui/badge"

const meta: Meta<typeof GHLProvider> = {
  title: "Auth/GHLProvider",
  component: GHLProvider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    clientId: {
      control: "text",
      description: "GoHighLevel OAuth Client ID",
    },
    clientSecret: {
      control: "text",
      description: "GoHighLevel OAuth Client Secret",
    },
    logLevel: {
      control: "select",
      options: ["debug", "info", "warn", "error"],
      description: "Logging level for the GHL client",
    },
  },
}
export default meta

type Story = StoryObj<typeof GHLProvider>

// Helper component to display context state
function ContextDisplay() {
  const context = useContext(GHLContext)

  if (!context) {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>GHL Context</CardTitle>
          <CardDescription>Context not available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            GHLProvider is not wrapping this component.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>GHL Context State</CardTitle>
        <CardDescription>Current authentication state</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Client Initialized:</span>
          <Badge variant={context.client ? "default" : "secondary"}>
            {context.client ? "Yes" : "No"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Authenticated:</span>
          <Badge variant={context.isAuthenticated ? "default" : "secondary"}>
            {context.isAuthenticated ? "Yes" : "No"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Loading:</span>
          <Badge variant={context.isLoading ? "outline" : "secondary"}>
            {context.isLoading ? "Yes" : "No"}
          </Badge>
        </div>
        {context.error && (
          <div className="pt-2 border-t">
            <span className="text-sm font-medium text-destructive">Error:</span>
            <p className="text-sm text-muted-foreground mt-1">{context.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export const Default: Story = {
  args: {
    clientId: "demo-client-id",
    clientSecret: "demo-client-secret",
    logLevel: "info",
  },
  render: (args) => (
    <GHLProvider {...args}>
      <ContextDisplay />
    </GHLProvider>
  ),
}

export const WithDebugLogging: Story = {
  args: {
    clientId: "demo-client-id",
    clientSecret: "demo-client-secret",
    logLevel: "debug",
  },
  render: (args) => (
    <GHLProvider {...args}>
      <ContextDisplay />
    </GHLProvider>
  ),
}

export const MissingCredentials: Story = {
  args: {
    // Intentionally omitting credentials to show error state
    clientId: undefined,
    clientSecret: undefined,
  },
  render: (args) => (
    <GHLProvider {...args}>
      <ContextDisplay />
    </GHLProvider>
  ),
}

export const WithChildren: Story = {
  args: {
    clientId: "demo-client-id",
    clientSecret: "demo-client-secret",
  },
  render: (args) => (
    <GHLProvider {...args}>
      <div className="space-y-4">
        <ContextDisplay />
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Child Component</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This component is wrapped by GHLProvider and can access the GHL context.
            </p>
          </CardContent>
        </Card>
      </div>
    </GHLProvider>
  ),
}

// Documentation about usage
export const Usage: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>GHLProvider Usage</CardTitle>
        <CardDescription>
          How to use the GHLProvider in your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Basic Setup</h4>
          <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`<GHLProvider
  clientId="your-client-id"
  clientSecret="your-client-secret"
>
  <App />
</GHLProvider>`}
          </pre>
        </div>
        <div>
          <h4 className="font-medium mb-2">Environment Variables</h4>
          <p className="text-sm text-muted-foreground mb-2">
            You can also use environment variables:
          </p>
          <pre className="bg-muted p-3 rounded-md text-sm">
{`NEXT_PUBLIC_GHL_CLIENT_ID=your-client-id
GHL_CLIENT_SECRET=your-client-secret`}
          </pre>
        </div>
        <div>
          <h4 className="font-medium mb-2">Accessing Context</h4>
          <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`import { useContext } from "react"
import { GHLContext } from "./ghl-provider"

function MyComponent() {
  const { client, isAuthenticated } = useContext(GHLContext)
  // ...
}`}
          </pre>
        </div>
      </CardContent>
    </Card>
  ),
}
