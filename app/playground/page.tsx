"use client"

import * as React from "react"
import { PlaygroundProvider } from "@/components/playground/playground-provider"
import { ApiKeyInput } from "@/components/playground/api-key-input"
import { AuthSection } from "@/components/playground/sections/auth-section"
import { ContactsSection } from "@/components/playground/sections/contacts-section"
import { CalendarsSection } from "@/components/playground/sections/calendars-section"
import { OpportunitiesSection } from "@/components/playground/sections/opportunities-section"
import { ConversationsSection } from "@/components/playground/sections/conversations-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const sections = [
  { id: "auth", label: "Auth" },
  { id: "contacts", label: "Contacts" },
  { id: "calendars", label: "Calendars" },
  { id: "opportunities", label: "Opportunities" },
  { id: "conversations", label: "Conversations" },
]

export default function PlaygroundPage() {
  return (
    <PlaygroundProvider>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Component Playground</h1>
              <p className="text-muted-foreground mt-1">
                See GHL components in action. Connect your account to view real data.
              </p>
            </div>
            <Badge variant="secondary" className="mt-2">Preview</Badge>
          </div>

          {/* API Key Input */}
          <div className="mb-8">
            <ApiKeyInput />
          </div>

          {/* Section Navigation */}
          <nav className="flex flex-wrap gap-2 mb-8 sticky top-0 z-10 bg-background/95 backdrop-blur py-3 -mx-4 px-4 border-b">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                size="sm"
                asChild
              >
                <a href={`#${section.id}`}>{section.label}</a>
              </Button>
            ))}
          </nav>

          {/* Sections */}
          <div className="space-y-12">
            <AuthSection />
            <ContactsSection />
            <CalendarsSection />
            <OpportunitiesSection />
            <ConversationsSection />
          </div>

          {/* Footer */}
          <footer className="border-t mt-16 py-8 text-center text-sm text-muted-foreground">
            <p>
              Components are installable via{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                npx shadcn@latest add
              </code>
              .{" "}
              <Link href="/" className="underline underline-offset-4 hover:text-foreground">
                View installation docs
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </PlaygroundProvider>
  )
}
