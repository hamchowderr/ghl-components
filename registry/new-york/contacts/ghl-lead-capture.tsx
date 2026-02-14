"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useGHLContactCreate } from "@/hooks/use-ghl-contact-create"
import { useGHLOpportunityCreate } from "@/hooks/use-ghl-opportunity-create"
import { useGHLPipelines } from "@/hooks/use-ghl-pipelines"
import { GHLPipelineSelect } from "../opportunities/ghl-pipeline-select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, AlertCircle, UserPlus } from "lucide-react"
import type { GHLPipelineStage } from "@/registry/new-york/server/types/opportunity"

/**
 * Props for the GHLLeadCapture component
 */
export interface GHLLeadCaptureProps {
  /**
   * The location ID
   */
  locationId: string
  /**
   * Pre-selected pipeline ID
   */
  pipelineId?: string
  /**
   * Default stage ID for the opportunity
   */
  defaultStageId?: string
  /**
   * Callback on successful lead capture
   */
  onSuccess?: (result: { contactId: string; opportunityId: string }) => void
  /**
   * Callback when cancelled
   */
  onCancel?: () => void
  /**
   * Card title
   * @default "Capture Lead"
   */
  title?: string
  /**
   * Card description
   */
  description?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Lead capture form that creates both a contact and an opportunity
 *
 * Collects contact information and opportunity details in a single form,
 * then creates both records sequentially in GoHighLevel.
 *
 * @example
 * ```tsx
 * <GHLLeadCapture
 *   locationId="loc_123"
 *   pipelineId="pipeline_456"
 *   onSuccess={({ contactId, opportunityId }) => {
 *     console.log("Created lead:", contactId, opportunityId)
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With a default stage
 * <GHLLeadCapture
 *   locationId="loc_123"
 *   pipelineId="pipeline_456"
 *   defaultStageId="stage_789"
 *   title="New Lead"
 *   description="Fill in the details to capture a new lead."
 *   onCancel={() => setShowForm(false)}
 * />
 * ```
 */
export function GHLLeadCapture({
  locationId,
  pipelineId: propPipelineId,
  defaultStageId,
  onSuccess,
  onCancel,
  title = "Capture Lead",
  description,
  className,
}: GHLLeadCaptureProps) {
  // Contact form state
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [companyName, setCompanyName] = React.useState("")

  // Opportunity form state
  const [selectedPipelineId, setSelectedPipelineId] = React.useState(
    propPipelineId || ""
  )
  const [selectedStageId, setSelectedStageId] = React.useState(
    defaultStageId || ""
  )
  const [oppName, setOppName] = React.useState("")
  const [monetaryValue, setMonetaryValue] = React.useState("")

  // Error state
  const [formError, setFormError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Mutations
  const { mutateAsync: createContact } = useGHLContactCreate()
  const { mutateAsync: createOpportunity } = useGHLOpportunityCreate()

  // Fetch pipelines to get stages
  const { pipelines } = useGHLPipelines({ locationId })

  // Get stages for selected pipeline
  const stages = React.useMemo(() => {
    if (!selectedPipelineId || !pipelines) return []
    const pipeline = (
      pipelines as Array<{ id: string; stages?: GHLPipelineStage[] }>
    ).find((p) => p.id === selectedPipelineId)
    return pipeline?.stages
      ? [...pipeline.stages].sort((a, b) => a.position - b.position)
      : []
  }, [selectedPipelineId, pipelines])

  // Update selected pipeline when prop changes
  React.useEffect(() => {
    if (propPipelineId) {
      setSelectedPipelineId(propPipelineId)
    }
  }, [propPipelineId])

  // Auto-select first stage when stages change (if no default)
  React.useEffect(() => {
    if (stages.length > 0 && !selectedStageId) {
      setSelectedStageId(stages[0].id)
    }
  }, [stages, selectedStageId])

  // Validation
  const isValid =
    firstName.trim() &&
    email.trim() &&
    selectedPipelineId &&
    selectedStageId

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isSubmitting) return

    setFormError(null)
    setIsSubmitting(true)

    try {
      // Step 1: Create contact
      const contactResult = (await createContact({
        locationId,
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim(),
        phone: phone.trim() || undefined,
        companyName: companyName.trim() || undefined,
      })) as { contact?: { id: string } }

      const contactId = contactResult?.contact?.id
      if (!contactId) {
        throw new Error("Failed to retrieve contact ID from creation response")
      }

      // Step 2: Create opportunity
      const oppResult = (await createOpportunity({
        locationId,
        pipelineId: selectedPipelineId,
        pipelineStageId: selectedStageId,
        contactId,
        name: oppName.trim() || `${firstName} ${lastName}`.trim(),
        monetaryValue: monetaryValue ? Number(monetaryValue) : undefined,
        status: "open",
      })) as { opportunity?: { id: string } }

      const opportunityId = oppResult?.opportunity?.id
      if (!opportunityId) {
        throw new Error(
          "Failed to retrieve opportunity ID from creation response"
        )
      }

      onSuccess?.({ contactId, opportunityId })
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to capture lead"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={cn("w-full max-w-lg", className)}>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {title}
          </CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="lead-firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lead-firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-lastName">Last Name</Label>
                <Input
                  id="lead-lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lead-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="lead-phone">Phone</Label>
                <Input
                  id="lead-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-company">Company</Label>
                <Input
                  id="lead-company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Inc."
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Opportunity Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Opportunity Details
            </h3>

            {/* Pipeline select */}
            {!propPipelineId && (
              <div className="space-y-1.5">
                <Label>
                  Pipeline <span className="text-destructive">*</span>
                </Label>
                <GHLPipelineSelect
                  locationId={locationId}
                  value={selectedPipelineId}
                  onValueChange={(id) => {
                    setSelectedPipelineId(id)
                    setSelectedStageId("") // Reset stage when pipeline changes
                  }}
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>
            )}

            {/* Stage select */}
            {stages.length > 0 && (
              <div className="space-y-1.5">
                <Label htmlFor="lead-stage">
                  Stage <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedStageId}
                  onValueChange={setSelectedStageId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="lead-stage">
                    <SelectValue placeholder="Select a stage..." />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="lead-oppName">Opportunity Name</Label>
                <Input
                  id="lead-oppName"
                  value={oppName}
                  onChange={(e) => setOppName(e.target.value)}
                  placeholder="New deal"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-value">Value ($)</Label>
                <Input
                  id="lead-value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={monetaryValue}
                  onChange={(e) => setMonetaryValue(e.target.value)}
                  placeholder="0"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Error display */}
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={cn(!onCancel && "ml-auto")}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Capture Lead
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
