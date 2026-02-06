"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, Plus } from "lucide-react"

export interface GHLTagManagerProps {
  contactId?: string
  selectedTags?: string[]
  availableTags?: string[]
  onTagsChange?: (tags: string[]) => void
  className?: string
}

/**
 * Tag Manager Component
 *
 * Allows adding and removing tags from contacts with autocomplete functionality.
 *
 * @example
 * ```tsx
 * <GHLTagManager
 *   contactId="contact_123"
 *   selectedTags={["Lead", "VIP"]}
 *   availableTags={["Lead", "Customer", "VIP", "Cold"]}
 *   onTagsChange={(tags) => console.log("Updated tags:", tags)}
 * />
 * ```
 */
export function GHLTagManager({
  selectedTags = [],
  availableTags = [],
  onTagsChange,
  className,
}: GHLTagManagerProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag]
      onTagsChange?.(newTags)
    }
    setSearchValue("")
    setOpen(false)
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove)
    onTagsChange?.(newTags)
  }

  const filteredTags = availableTags.filter(
    (tag) =>
      !selectedTags.includes(tag) &&
      tag.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="pr-1">
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 hover:bg-muted-foreground/20 rounded-full p-0.5"
              aria-label={`Remove ${tag} tag`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search tags..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                {searchValue ? (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => handleAddTag(searchValue)}
                  >
                    Create "{searchValue}"
                  </Button>
                ) : (
                  "No tags found."
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredTags.map((tag) => (
                  <CommandItem
                    key={tag}
                    value={tag}
                    onSelect={() => handleAddTag(tag)}
                  >
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
