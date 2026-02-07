"use client"

import * as React from "react"
import { Loader2, X, Check } from "lucide-react"
import { z } from "zod"
import { toast } from "sonner"

import { useGHLContactCreate } from "@/hooks/use-ghl-contact-create"
import { useGHLContactUpdate } from "@/hooks/use-ghl-contact-update"
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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Contact form validation schema
const contactFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number (use E.164 format)")
    .optional()
    .or(z.literal("")),
  companyName: z.string().optional(),
  dnd: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
})

type ContactFormData = z.infer<typeof contactFormSchema>

export interface GHLContactFormProps {
  /**
   * Existing contact data for editing. If provided, form will be in edit mode.
   */
  contact?: {
    id: string
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    companyName?: string
    dnd?: boolean
    tags?: string[]
    [key: string]: unknown
  }
  /**
   * Location ID for creating new contacts (required in create mode)
   */
  locationId?: string
  /**
   * Callback fired when the form is successfully submitted
   */
  onSuccess?: (contact: unknown) => void
  /**
   * Callback fired when the cancel button is clicked
   */
  onCancel?: () => void
  /**
   * Form mode: "create" or "edit". Auto-detected based on contact prop if not specified.
   */
  mode?: "create" | "edit"
  /**
   * Optional list of available tags for the tag selector
   */
  availableTags?: string[]
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

export function GHLContactForm({
  contact,
  locationId,
  onSuccess,
  onCancel,
  mode: providedMode,
  availableTags = [],
  title,
  description,
  className,
}: GHLContactFormProps) {
  // Determine mode
  const mode = providedMode || (contact ? "edit" : "create")
  const isEditMode = mode === "edit"

  // Mutations
  const { mutate: createContact, isPending: isCreating } =
    useGHLContactCreate()
  const { mutate: updateContact, isPending: isUpdating } =
    useGHLContactUpdate()

  const isPending = isCreating || isUpdating

  // Form state
  const [formState, setFormState] = React.useState<{
    defaultValues: ContactFormData
    errors: Partial<Record<keyof ContactFormData, string>>
    submitError: string | null
  }>({
    defaultValues: {
      firstName: contact?.firstName || "",
      lastName: contact?.lastName || "",
      email: contact?.email || "",
      phone: contact?.phone || "",
      companyName: contact?.companyName || "",
      dnd: contact?.dnd || false,
      tags: contact?.tags || [],
    },
    errors: {},
    submitError: null,
  })

  // Tag management state
  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    contact?.tags || []
  )
  const [tagInput, setTagInput] = React.useState("")
  const [tagPopoverOpen, setTagPopoverOpen] = React.useState(false)

  // Add tag
  const addTag = React.useCallback((tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags((prev) => [...prev, trimmedTag])
      setTagInput("")
      setTagPopoverOpen(false)
    }
  }, [selectedTags])

  // Remove tag
  const removeTag = React.useCallback((tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }, [])

  // Handle form submission
  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const formData = new FormData(e.target as HTMLFormElement)
      const data = {
        firstName: (formData.get("firstName") as string) || undefined,
        lastName: (formData.get("lastName") as string) || undefined,
        email: (formData.get("email") as string) || undefined,
        phone: (formData.get("phone") as string) || undefined,
        companyName: (formData.get("companyName") as string) || undefined,
        dnd: formData.get("dnd") === "on",
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      }

      // Validate with Zod
      const result = contactFormSchema.safeParse(data)

      if (!result.success) {
        setFormState((prev) => ({
          ...prev,
          errors: Object.fromEntries(
            Object.entries(result.error.flatten().fieldErrors).map(
              ([key, value]) => [key, value?.[0] ?? ""]
            )
          ) as Partial<Record<keyof ContactFormData, string>>,
          submitError: null,
        }))
        return
      }

      // Clear errors
      setFormState((prev) => ({
        ...prev,
        errors: {},
        submitError: null,
      }))

      // Submit based on mode
      if (isEditMode && contact) {
        updateContact(
          {
            contactId: contact.id,
            ...result.data,
          },
          {
            onSuccess: (updatedContact: unknown) => {
              toast.success("Contact updated successfully")
              onSuccess?.(updatedContact)
            },
            onError: (error: Error) => {
              const errorMessage = error.message || "Failed to update contact"
              setFormState((prev) => ({
                ...prev,
                submitError: errorMessage,
              }))
              toast.error(errorMessage)
            },
          }
        )
      } else {
        // Create mode
        if (!locationId) {
          setFormState((prev) => ({
            ...prev,
            submitError: "Location ID is required to create a contact",
          }))
          return
        }

        createContact(
          {
            locationId,
            ...result.data,
          },
          {
            onSuccess: (newContact: unknown) => {
              toast.success("Contact created successfully")
              // Reset form for create mode
              const form = e.target as HTMLFormElement
              form.reset()
              setSelectedTags([])
              setFormState({
                defaultValues: {
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  companyName: "",
                  dnd: false,
                  tags: [],
                },
                errors: {},
                submitError: null,
              })
              onSuccess?.(newContact)
            },
            onError: (error: Error) => {
              const errorMessage = error.message || "Failed to create contact"
              setFormState((prev) => ({
                ...prev,
                submitError: errorMessage,
              }))
              toast.error(errorMessage)
            },
          }
        )
      }
    },
    [
      isEditMode,
      contact,
      selectedTags,
      locationId,
      createContact,
      updateContact,
      onSuccess,
    ]
  )

  // Filtered available tags (exclude already selected)
  const filteredAvailableTags = React.useMemo(() => {
    return availableTags.filter(
      (tag) =>
        !selectedTags.includes(tag) &&
        tag.toLowerCase().includes(tagInput.toLowerCase())
    )
  }, [availableTags, selectedTags, tagInput])

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Card>
        <CardHeader>
          <CardTitle>
            {title || (isEditMode ? "Edit Contact" : "Create Contact")}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Submit Error Alert */}
          {formState.submitError && (
            <Alert variant="destructive">
              <AlertDescription>{formState.submitError}</AlertDescription>
            </Alert>
          )}

          {/* First Name */}
          <div
            className="group/field grid gap-2"
            data-invalid={!!formState.errors?.firstName}
          >
            <Label
              htmlFor="firstName"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={isPending}
              aria-invalid={!!formState.errors?.firstName}
              aria-errormessage="error-firstName"
              defaultValue={formState.defaultValues.firstName}
            />
            {formState.errors?.firstName && (
              <p id="error-firstName" className="text-destructive text-sm">
                {formState.errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div
            className="group/field grid gap-2"
            data-invalid={!!formState.errors?.lastName}
          >
            <Label
              htmlFor="lastName"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={isPending}
              aria-invalid={!!formState.errors?.lastName}
              aria-errormessage="error-lastName"
              defaultValue={formState.defaultValues.lastName}
            />
            {formState.errors?.lastName && (
              <p id="error-lastName" className="text-destructive text-sm">
                {formState.errors.lastName}
              </p>
            )}
          </div>

          {/* Email */}
          <div
            className="group/field grid gap-2"
            data-invalid={!!formState.errors?.email}
          >
            <Label
              htmlFor="email"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={isPending}
              aria-invalid={!!formState.errors?.email}
              aria-errormessage="error-email"
              defaultValue={formState.defaultValues.email}
            />
            {formState.errors?.email && (
              <p id="error-email" className="text-destructive text-sm">
                {formState.errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div
            className="group/field grid gap-2"
            data-invalid={!!formState.errors?.phone}
          >
            <Label
              htmlFor="phone"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+15551234567"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={isPending}
              aria-invalid={!!formState.errors?.phone}
              aria-errormessage="error-phone"
              defaultValue={formState.defaultValues.phone}
            />
            {formState.errors?.phone && (
              <p id="error-phone" className="text-destructive text-sm">
                {formState.errors.phone}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Use E.164 format (e.g., +15551234567)
            </p>
          </div>

          {/* Company Name */}
          <div
            className="group/field grid gap-2"
            data-invalid={!!formState.errors?.companyName}
          >
            <Label
              htmlFor="companyName"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Company Name
            </Label>
            <Input
              id="companyName"
              name="companyName"
              placeholder="Acme Inc."
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={isPending}
              aria-invalid={!!formState.errors?.companyName}
              aria-errormessage="error-companyName"
              defaultValue={formState.defaultValues.companyName}
            />
            {formState.errors?.companyName && (
              <p id="error-companyName" className="text-destructive text-sm">
                {formState.errors.companyName}
              </p>
            )}
          </div>

          {/* DND Toggle */}
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="dnd">Do Not Disturb</Label>
              <p className="text-xs text-muted-foreground">
                Block marketing communications to this contact
              </p>
            </div>
            <Switch
              id="dnd"
              name="dnd"
              defaultChecked={formState.defaultValues.dnd}
              disabled={isPending}
            />
          </div>

          {/* Tags */}
          <div className="grid gap-2">
            <Label>Tags</Label>
            <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="justify-start text-left font-normal"
                  disabled={isPending}
                >
                  {selectedTags.length > 0
                    ? `${selectedTags.length} tag(s) selected`
                    : "Select tags..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search or add tag..."
                    value={tagInput}
                    onValueChange={setTagInput}
                  />
                  <CommandList>
                    <CommandEmpty>
                      <div className="px-2 py-3 text-sm">
                        <p className="text-muted-foreground mb-2">
                          No tags found.
                        </p>
                        {tagInput.trim() && (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => addTag(tagInput)}
                            className="w-full"
                          >
                            Add &quot;{tagInput.trim()}&quot;
                          </Button>
                        )}
                      </div>
                    </CommandEmpty>
                    {filteredAvailableTags.length > 0 && (
                      <CommandGroup heading="Available Tags">
                        {filteredAvailableTags.map((tag) => (
                          <CommandItem
                            key={tag}
                            value={tag}
                            onSelect={() => addTag(tag)}
                          >
                            <Check
                              className={
                                selectedTags.includes(tag)
                                  ? "opacity-100"
                                  : "opacity-0"
                              }
                            />
                            {tag}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    {tagInput.trim() &&
                      !filteredAvailableTags.includes(tagInput.trim()) && (
                        <CommandGroup>
                          <CommandItem onSelect={() => addTag(tagInput)}>
                            Add &quot;{tagInput.trim()}&quot;
                          </CommandItem>
                        </CommandGroup>
                      )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      disabled={isPending}
                      className="ml-1 rounded-full hover:bg-destructive/10"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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
                ? "Update Contact"
                : "Save Contact"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
