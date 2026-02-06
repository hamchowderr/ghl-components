"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { useGHLCalendars } from "@/hooks/use-ghl-calendars"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface GHLCalendarSelectProps {
  locationId: string
  value?: string
  onChange?: (calendarId: string) => void
  placeholder?: string
  className?: string
}

export function GHLCalendarSelect({
  locationId,
  value,
  onChange,
  placeholder = "Select calendar...",
  className,
}: GHLCalendarSelectProps) {
  const [open, setOpen] = React.useState(false)

  const { data, isLoading, error } = useGHLCalendars(
    { locationId },
    { enabled: !!locationId }
  )

  const calendars = React.useMemo(() => {
    return (data as any)?.calendars || []
  }, [data])

  const selectedCalendar = React.useMemo(() => {
    return calendars.find((cal: any) => cal.id === value)
  }, [calendars, value])

  const handleSelect = React.useCallback(
    (calendarId: string) => {
      if (onChange) {
        onChange(calendarId)
      }
      setOpen(false)
    },
    [onChange]
  )

  // Loading state
  if (isLoading) {
    return (
      <Button
        variant="outline"
        role="combobox"
        className={cn("justify-between", className)}
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading calendars...
      </Button>
    )
  }

  // Error state
  if (error) {
    return (
      <Button
        variant="outline"
        role="combobox"
        className={cn("justify-between text-destructive", className)}
        disabled
      >
        Error loading calendars
      </Button>
    )
  }

  // Empty state
  if (calendars.length === 0) {
    return (
      <Button
        variant="outline"
        role="combobox"
        className={cn("justify-between", className)}
        disabled
      >
        No calendars available
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {selectedCalendar ? selectedCalendar.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search calendars..." />
          <CommandEmpty>No calendar found.</CommandEmpty>
          <CommandGroup>
            {calendars.map((calendar: any) => (
              <CommandItem
                key={calendar.id}
                value={calendar.name}
                onSelect={() => handleSelect(calendar.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === calendar.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{calendar.name}</span>
                  {calendar.description && (
                    <span className="text-xs text-muted-foreground">
                      {calendar.description}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
