"use client"

import * as React from "react"
import { DemoSection } from "../demo-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ExternalLink } from "lucide-react"

export function AuthSection() {
  const [isConnected, setIsConnected] = React.useState(false)

  return (
    <DemoSection
      title="Authentication"
      description="OAuth connect buttons, callback handlers, and location switchers."
      category="auth"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">GHL Connect Button</CardTitle>
            <CardDescription>
              One-click OAuth connection to GoHighLevel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => setIsConnected(!isConnected)}
              variant={isConnected ? "outline" : "default"}
              className="w-full"
            >
              {isConnected ? (
                <>
                  <Check className="h-4 w-4" />
                  Connected to GoHighLevel
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Connect to GoHighLevel
                </>
              )}
            </Button>
            {isConnected && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">Demo</Badge>
                This is a preview — OAuth requires server-side setup.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">GHL Location Switcher</CardTitle>
            <CardDescription>
              Switch between sub-accounts for agency accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: "Bright Smile Dental", id: "loc-1" },
                { name: "Kim Realty Group", id: "loc-2" },
                { name: "Peak Fitness Studio", id: "loc-3" },
              ].map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent cursor-pointer"
                >
                  <span>{location.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {location.id}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DemoSection>
  )
}
