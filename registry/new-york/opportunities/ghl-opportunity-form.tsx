"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { z } from "zod"
import { toast } from "sonner"

import { useGHLOpportunityCreate } from "@/hooks/use-ghl-opportunity-create"
import { useGHLOpportunityUpdate } from "@/hooks/use-ghl-opportunity-update"
import { useGHLPipelines } from "@/hooks/use-ghl-pipelines"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Opportunity form validation schema
const opportunityFormSchema = z.object({
  name: z.string().min(1, "Opportunity name is required"),
  pipelineId: z.string().min(1, "Pipeline is required"),
  pipelineStageId: z.string().min(1, "Stage is required"),
  contactId: z.string().min(1, "Contact is required"),
  status: z.enum(["open", "won", "lost", "abandoned"]).default("open"),
  monetaryValue: z.number().min(0, "Value must be positive").optional(),
  assignedTo: z.string().optional(),
  source: z.string().optional(),
})

type OpportunityFormData = z.infer<typeof opportunityFormSchema>

export interface GHLOpportunityFormProps {
  /**
   * Existing opportunity data for editing. If provided, form will be in edit mode.
   */
  opportunity?: {
    id: string
    name: string
    pipelineId: string
    pipelineStageId: string
    contactId: string
    status: "open" | "won" | "lost" | "abandoned"
    monetaryValue?: number
    assignedTo?: string
    source?: string
    [key: string]: unknown
  }
  /**
   * Location ID for fetching pipelines and creating opportunities
   */
  locationId: string
  /**
   * Pre-selected pipeline ID (for create mode)
   */
  defaultPipelineId?: string
  /**
   * Pre-selected stage ID (for create mode)
   */
  defaultStageId?: string
  /**
   * Pre-selected contact ID (for create mode)
   */
  defaultContactId?: string
  /**
   * Callback fired when the form is successfully submitted
   */
  onSuccess?: (opportunity: unknown) => void
  /**
   * Callback fired when the cancel button is clicked
   */
  onCancel?: () => void
  /**
   * Form mode: "create" or "edit". Auto-detected based on opportunity prop if not specified.
   */
  mode?: "create" | "edit"
  /**
   * Custom form title
   */
  title?: string
  /**
   * Custom form description
   */
  description?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Create or edit form for GoHighLevel opportunities with full Zod validation.
 *
 * @example
 * ```tsx
 * // Create mode
 * <GHLOpportunityForm
 *   locationId="loc-123"
 *   defaultContactId="contact-123"
 *   onSuccess={(opp) => console.log('Created:', opp)}
 *   onCancel={() => setOpen(false)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Edit mode
 * <GHLOpportunityForm
 *   locationId="loc-123"
 *   opportunity={existingOpportunity}
 *   onSuccess={(opp) => console.log('Updated:', opp)}
 *   onCancel={() => setOpen(false)}
 * />
 * ```
 */
export function GHLOpportunityForm({
  opportunity,
  locationId,
  defaultPipelineId,
  defaultStageId,
  defaultContactId,
  onSuccess,
  onCancel,
  mode: providedMode,
  title,
  description,
  className,
}: GHLOpportunityFormProps) {
  // Determine mode
  const mode = providedMode || (opportunity ? "edit" : "create")
  const isEditMode = mode === "edit"

  // Fetch pipelines for dropdown
  const { pipelines, isLoading: isPipelinesLoading } = useGHLPipelines({
    locationId,
  })

  // Type the pipelines
  const typedPipelines = pipelines as Array<{
    id: string
    name: string
    stages: Array<{ id: string; name: string; position: number }>
  }>

  // Mutations
  const { mutate: createOpportunity, isPending: isCreating } = useGHLOpportunityCreate()
  const { mutate: updateOpportunity, isPending: isUpdating } = useGHLOpportunityUpdate()

  const isPending = isCreating || isUpdating

  // Form state
  const [selectedPipelineId, setSelectedPipelineId] = React.useState<string>(
    opportunity?.pipelineId || defaultPipelineId || ""
  )
  const [selectedStageId, setSelectedStageId] = React.useState<string>(
    opportunity?.pipelineStageId || defaultStageId || ""
  )
  const [selectedStatus, setSelectedStatus] = React.useState<string>(
    opportunity?.status || "open"
  )
  const [errors, setErrors] = React.useState<Partial<Record<keyof OpportunityFormData, string>>>({})
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  // Get stages for selected pipeline
  const stages = React.useMemo(() => {
    const pipeline = typedPipelines.find((p) => p.id === selectedPipelineId)
    return pipeline?.stages?.sort((a, b) => a.position - b.position) || []
  }, [typedPipelines, selectedPipelineId])

  // Reset stage when pipeline changes (in create mode)
  React.useEffect(() => {
    if (!isEditMode && stages.length > 0 && !stages.find((s) => s.id === selectedStageId)) {
      setSelectedStageId(stages[0].id)
    }
  }, [stages, selectedStageId, isEditMode])

  // Handle form submission
  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const formData = new FormData(e.target as HTMLFormElement)
      const monetaryValueStr = formData.get("monetaryValue") as string

      const data = {
        name: (formData.get("name") as string) || "",
        pipelineId: selectedPipelineId,
        pipelineStageId: selectedStageId,
        contactId: (formData.get("contactId") as string) || defaultContactId || "",
        status: selectedStatus as "open" | "won" | "lost" | "abandoned",
        monetaryValue: monetaryValueStr ? Number(monetaryValueStr) : undefined,
        assignedTo: (formData.get("assignedTo") as string) || undefined,
        source: (formData.get("source") as string) || undefined,
      }

      // Validate with Zod
      const result = opportunityFormSchema.safeParse(data)

      if (!result.success) {
        setErrors(
          Object.fromEntries(
            Object.entries(result.error.flatten().fieldErrors).map(
              ([key, value]) => [key, value?.[0] ?? ""]
            )
          ) as Partial<Record<keyof OpportunityFormData, string>>
        )
        setSubmitError(null)
        return
      }

      // Clear errors
      setErrors({})
      setSubmitError(null)

      // Submit based on mode
      if (isEditMode && opportunity) {
        updateOpportunity(
          {
            id: opportunity.id,
            name: result.data.name,
            pipelineStageId: result.data.pipelineStageId,
            status: result.data.status,
            monetaryValue: result.data.monetaryValue,
            assignedTo: result.data.assignedTo,
          },
          {
            onSuccess: (updatedOpportunity: unknown) => {
              toast.success("Opportunity updated successfully")
              onSuccess?.(updatedOpportunity)
            },
            onError: (error: Error) => {
              const errorMessage = error.message || "Failed to update opportunity"
              setSubmitError(errorMessage)
              toast.error(errorMessage)
            },
          }
        )
      } else {
        createOpportunity(
          {
            locationId,
            ...result.data,
          },
          {
            onSuccess: (newOpportunity: unknown) => {
              toast.success("Opportunity created successfully")
              // Reset form
              const form = e.target as HTMLFormElement
              form.reset()
              setSelectedPipelineId(defaultPipelineId || "")
              setSelectedStageId(defaultStageId || "")
              setSelectedStatus("open")
              onSuccess?.(newOpportunity)
            },
            onError: (error: Error) => {
              const errorMessage = error.message || "Failed to create opportunity"
              setSubmitError(errorMessage)
              toast.error(errorMessage)
            },
          }
        )
      }
    },
    [
      isEditMode,
      opportunity,
      selectedPipelineId,
      selectedStageId,
      selectedStatus,
      defaultContactId,
      locationId,
      defaultPipelineId,
      defaultStageId,
      createOpportunity,
      updateOpportunity,
      onSuccess,
    ]
  )

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Card>
        <CardHeader>
          <CardTitle>
            {title || (isEditMode ? "Edit Opportunity" : "Create Opportunity")}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Submit Error Alert */}
          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Opportunity Name */}
          <div
            className="group/field grid gap-2"
            data-invalid={!!errors.name}
          >
            <Label
              htmlFor="name"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Opportunity Name *
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="New Deal"
              className="group-data-[invalid=true]/field:border-destructive"
              disabled={isPending}
              aria-invalid={!!errors.name}
              defaultValue={opportunity?.name || ""}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name}</p>
            )}
          </div>

          {/* Pipeline Select */}
          <div
            className="group/field grid gap-2"
            data-invalid={!!errors.pipelineId}
          >
            <Label
              htmlFor="pipelineId"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Pipeline *
            </Label>
            <Select
              value={selectedPipelineId}
              onValueChange={setSelectedPipelineId}
              disabled={isPending || isPipelinesLoading || isEditMode}
            >
              <SelectTrigger
                id="pipelineId"
                className="group-data-[invalid=true]/field:border-destructive"
              >
                <SelectValue placeholder="Select pipeline..." />
              </SelectTrigger>
              <SelectContent>
                {typedPipelines.map((pipeline) => (
                  <SelectItem key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pipelineId && (
              <p className="text-destructive text-sm">{errors.pipelineId}</p>
            )}
          </div>

          {/* Stage Select */}
          <div
            className="group/field grid gap-2"
            data-invalid={!!errors.pipelineStageId}
          >
            <Label
              htmlFor="pipelineStageId"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Stage *
            </Label>
            <Select
              value={selectedStageId}
              onValueChange={setSelectedStageId}
              disabled={isPending || !selectedPipelineId || stages.length === 0}
            >
              <SelectTrigger
                id="pipelineStageId"
                className="group-data-[invalid=true]/field:border-destructive"
              >
                <SelectValue placeholder="Select stage..." />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pipelineStageId && (
              <p className="text-destructive text-sm">{errors.pipelineStageId}</p>
            )}
          </div>

          {/* Contact ID */}
          <div
            className="group/field grid gap-2"
            data-invalid={!!errors.contactId}
          >
            <Label
              htmlFor="contactId"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Contact ID *
            </Label>
            <Input
              id="contactId"
              name="contactId"
              placeholder="contact-123"
              className="group-data-[invalid=true]/field:border-destructive"
              disabled={isPending || isEditMode}
              aria-invalid={!!errors.contactId}
              defaultValue={opportunity?.contactId || defaultContactId || ""}
            />
            {errors.contactId && (
              <p className="text-destructive text-sm">{errors.contactId}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Use a contact picker component to select a contact
            </p>
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              disabled={isPending}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Monetary Value */}
          <div
            className="group/field grid gap-2"
            data-invalid={!!errors.monetaryValue}
          >
            <Label
              htmlFor="monetaryValue"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Value ($)
            </Label>
            <Input
              id="monetaryValue"
              name="monetaryValue"
              type="number"
              min="0"
              step="0.01"
              placeholder="10000"
              className="group-data-[invalid=true]/field:border-destructive"
              disabled={isPending}
              aria-invalid={!!errors.monetaryValue}
              defaultValue={opportunity?.monetaryValue || ""}
            />
            {errors.monetaryValue && (
              <p className="text-destructive text-sm">{errors.monetaryValue}</p>
            )}
          </div>

          {/* Source */}
          <div className="grid gap-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              name="source"
              placeholder="Website, Referral, etc."
              disabled={isPending}
              defaultValue={opportunity?.source || ""}
            />
          </div>

          {/* Assigned To */}
          <div className="grid gap-2">
            <Label htmlFor="assignedTo">Assigned To (User ID)</Label>
            <Input
              id="assignedTo"
              name="assignedTo"
              placeholder="user-123"
              disabled={isPending}
              defaultValue={opportunity?.assignedTo || ""}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Opportunity"
                : "Create Opportunity"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
