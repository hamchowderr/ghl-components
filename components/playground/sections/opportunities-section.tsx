"use client"

import * as React from "react"
import { usePlayground } from "../playground-provider"
import { DemoSection } from "../demo-section"
import { OpportunityCardPreview } from "../previews/opportunity-card-preview"
import { mockOpportunities, mockPipelineStages, mockContacts } from "@/lib/showcase/mock-data"
import { Loader2 } from "lucide-react"

interface OpportunityPreview {
  id: string
  name: string
  pipelineId: string
  pipelineStageId: string
  status: "open" | "won" | "lost" | "abandoned"
  contactId: string
  monetaryValue?: number
  source?: string
  dateAdded: string
  dateUpdated: string
  [key: string]: unknown
}

export function OpportunitiesSection() {
  const { mode, isConnected, fetchGHL } = usePlayground()
  const [opportunities, setOpportunities] = React.useState<OpportunityPreview[]>(mockOpportunities)
  const [isLoading, setIsLoading] = React.useState(false)

  const contactNames = React.useMemo(() => {
    const names: Record<string, string> = {}
    mockContacts.forEach((c) => {
      names[c.id] = `${c.firstName} ${c.lastName}`
    })
    return names
  }, [])

  const stageNames = React.useMemo(() => {
    const names: Record<string, string> = {}
    mockPipelineStages.forEach((s) => {
      names[s.id] = s.name
    })
    return names
  }, [])

  React.useEffect(() => {
    if (mode === "live" && isConnected) {
      setIsLoading(true)
      fetchGHL<{ opportunities?: Array<Record<string, unknown>> }>("opportunities/search", { limit: "5" })
        .then((data) => {
          if (data.opportunities && data.opportunities.length > 0) {
            setOpportunities(
              data.opportunities.map((o) => ({
                id: (o.id as string) || "",
                name: (o.name as string) || "Untitled",
                pipelineId: (o.pipelineId as string) || "",
                pipelineStageId: (o.pipelineStageId as string) || "",
                status: (o.status as "open" | "won" | "lost" | "abandoned") || "open",
                contactId: (o.contactId as string) || "",
                monetaryValue: (o.monetaryValue as number) || 0,
                source: (o.source as string) || undefined,
                dateAdded: (o.dateAdded as string) || new Date().toISOString(),
                dateUpdated: (o.dateUpdated as string) || new Date().toISOString(),
              }))
            )
          }
        })
        .catch(() => {
          setOpportunities(mockOpportunities)
        })
        .finally(() => setIsLoading(false))
    } else {
      setOpportunities(mockOpportunities)
    }
  }, [mode, isConnected, fetchGHL])

  return (
    <DemoSection
      title="Opportunities & Pipelines"
      description="Pipeline boards, opportunity cards, stage selectors, and deal management."
      category="opportunities"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.slice(0, 3).map((opportunity) => (
            <OpportunityCardPreview
              key={opportunity.id}
              opportunity={opportunity}
              stageName={stageNames[opportunity.pipelineStageId] || "Pipeline Stage"}
              contactName={contactNames[opportunity.contactId] || "Contact"}
            />
          ))}
        </div>
      )}
    </DemoSection>
  )
}
