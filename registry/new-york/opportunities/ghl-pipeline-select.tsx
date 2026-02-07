"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { useGHLPipelines } from "@/hooks/use-ghl-pipelines"
import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"

export interface GHLPipelineSelectProps {
  /**
   * The location ID to fetch pipelines from
   */
  locationId: string
  /**
   * Currently selected pipeline ID
   */
  value?: string
  /**
   * Callback when a pipeline is selected
   */
  onValueChange?: (pipelineId: string) => void
  /**
   * Placeholder text when no pipeline is selected
   */
  placeholder?: string
  /**
   * Whether the select is disabled
   */
  disabled?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Dropdown select for choosing a GoHighLevel pipeline.
 * Fetches pipelines from the GHL API and displays them in a searchable dropdown.
 *
 * @example
 * ```tsx
 * function PipelineFilter() {
 *   const [selectedPipeline, setSelectedPipeline] = React.useState<string>()
 *
 *   return (
 *     <GHLPipelineSelect
 *       locationId="abc123"
 *       value={selectedPipeline}
 *       onValueChange={setSelectedPipeline}
 *       placeholder="Select a pipeline..."
 *     />
 *   )
 * }
 * ```
 */
export function GHLPipelineSelect({
  locationId,
  value,
  onValueChange,
  placeholder = "Select pipeline...",
  disabled = false,
  className,
}: GHLPipelineSelectProps) {
  const [open, setOpen] = React.useState(false)

  // Fetch pipelines
  const { pipelines, isLoading, error } = useGHLPipelines({
    locationId,
  })

  // Type the pipelines array
  const typedPipelines = pipelines as Array<{
    id: string
    name: string
    stages?: Array<{ id: string; name: string; position: number }>
  }>

  // Find selected pipeline
  const selectedPipeline = React.useMemo(() => {
    return typedPipelines.find((p) => p.id === value)
  }, [typedPipelines, value])

  // Handle selection
  const handleSelect = React.useCallback(
    (pipelineId: string) => {
      onValueChange?.(pipelineId)
      setOpen(false)
    },
    [onValueChange]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select pipeline"
          disabled={disabled || isLoading}
          className={cn("w-full justify-between", className)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading pipelines...
            </>
          ) : selectedPipeline ? (
            <span className="truncate">{selectedPipeline.name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search pipelines..." />
          <CommandList>
            {error ? (
              <CommandEmpty>
                Error loading pipelines: {error.message}
              </CommandEmpty>
            ) : typedPipelines.length === 0 ? (
              <CommandEmpty>No pipelines found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {typedPipelines.map((pipeline) => (
                  <CommandItem
                    key={pipeline.id}
                    value={pipeline.name}
                    onSelect={() => handleSelect(pipeline.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === pipeline.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{pipeline.name}</span>
                      {pipeline.stages && pipeline.stages.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {pipeline.stages.length} stages
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
