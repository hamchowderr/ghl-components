"use client"

import * as React from "react"
import { DemoSection } from "../demo-section"
import { GHLMessageBubble } from "@/registry/new-york/conversations/ghl-message-bubble"
import { GHLChannelIcon } from "@/registry/new-york/conversations/ghl-channel-icon"
import { mockMessages, mockChannels } from "@/lib/showcase/mock-data"
import type { GHLMessageType } from "@/registry/new-york/server/types/conversation"
import { getChannelLabel } from "@/registry/new-york/conversations/ghl-channel-icon"

export function ConversationsSection() {
  return (
    <DemoSection
      title="Conversations"
      description="Message threads, channel icons, composers, and conversation inbox."
      category="conversations"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Channel Icons</h3>
          <div className="flex flex-wrap gap-4">
            {mockChannels.map((channel) => (
              <div key={channel} className="flex items-center gap-2 rounded-md border px-3 py-2 bg-background">
                <GHLChannelIcon channel={channel as GHLMessageType} size={18} />
                <span className="text-sm">{getChannelLabel(channel as GHLMessageType)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Message Thread</h3>
          <div className="max-w-lg space-y-3 rounded-lg border bg-background p-4">
            {mockMessages.filter((m) => m.conversationId === "conv-1").map((message) => (
              <GHLMessageBubble key={message.id} message={message} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Email Thread</h3>
          <div className="max-w-lg space-y-3 rounded-lg border bg-background p-4">
            {mockMessages.filter((m) => m.conversationId === "conv-2").map((message) => (
              <GHLMessageBubble key={message.id} message={message} />
            ))}
          </div>
        </div>
      </div>
    </DemoSection>
  )
}
