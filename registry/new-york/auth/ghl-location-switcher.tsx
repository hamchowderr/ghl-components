"use client"

import * as React from "react"
import { useGHL } from "@/hooks/use-ghl"
import { cn } from "@/lib/utils"

interface Location {
  id: string
  name: string
  address?: string
  logoUrl?: string
}

interface GHLLocationSwitcherProps {
  /**
   * Currently selected location ID.
   */
  value?: string

  /**
   * Callback fired when location is changed.
   * @param locationId - The ID of the newly selected location
   */
  onChange?: (locationId: string) => void

  /**
   * Placeholder text when no location is selected.
   * @default "Select a location"
   */
  placeholder?: string

  /**
   * Additional CSS classes for the select container.
   */
  className?: string

  /**
   * Callback fired when location fetch fails.
   * @param error - The error that occurred
   */
  onError?: (error: Error) => void

  /**
   * Whether to show location avatar/logo.
   * @default true
   */
  showAvatar?: boolean

  /**
   * Whether to show a badge on the current location.
   * @default true
   */
  showCurrentBadge?: boolean
}

/**
 * Location switcher dropdown component for GoHighLevel agencies.
 *
 * This component fetches and displays all locations accessible to the authenticated user,
 * allowing them to switch between different locations. Particularly useful for agency
 * accounts that manage multiple client locations.
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const [currentLocation, setCurrentLocation] = useState<string>()
 *
 *   return (
 *     <GHLLocationSwitcher
 *       value={currentLocation}
 *       onChange={(locationId) => {
 *         setCurrentLocation(locationId)
 *         // Fetch data for the new location
 *       }}
 *       onError={(error) => toast.error(error.message)}
 *     />
 *   )
 * }
 * ```
 */
export function GHLLocationSwitcher({
  value,
  onChange,
  placeholder = "Select a location",
  className,
  onError,
  showAvatar = true,
  showCurrentBadge = true,
}: GHLLocationSwitcherProps) {
  const { client, isAuthenticated } = useGHL()

  const [locations, setLocations] = React.useState<Location[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)

  // Fetch locations when component mounts or authentication state changes
  React.useEffect(() => {
    const fetchLocations = async () => {
      if (!client || !isAuthenticated) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Fetch all locations accessible to the user
        const response = await client.locations.getAllLocations()

        // Transform response to our Location interface
        const fetchedLocations: Location[] =
          response.locations?.map((loc: any) => ({
            id: loc.id,
            name: loc.name || "Unnamed Location",
            address: loc.address,
            logoUrl: loc.logoUrl,
          })) || []

        setLocations(fetchedLocations)
      } catch (err) {
        const errorObj =
          err instanceof Error ? err : new Error("Failed to fetch locations")

        setError(errorObj)
        onError?.(errorObj)
        console.error("Failed to fetch locations:", errorObj)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [client, isAuthenticated, onError])

  const selectedLocation = React.useMemo(
    () => locations.find((loc) => loc.id === value),
    [locations, value]
  )

  const handleLocationChange = (locationId: string) => {
    onChange?.(locationId)
    setIsOpen(false)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={cn("relative w-full", className)}>
      {/* Select trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || !!error}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select location"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
              <span className="text-muted-foreground">Loading locations...</span>
            </div>
          ) : error ? (
            <span className="text-destructive">Failed to load locations</span>
          ) : selectedLocation ? (
            <>
              {showAvatar && (
                <LocationAvatar
                  name={selectedLocation.name}
                  logoUrl={selectedLocation.logoUrl}
                />
              )}
              <span className="truncate">{selectedLocation.name}</span>
              {showCurrentBadge && (
                <span className="ml-auto shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  Current
                </span>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>

        <svg
          className={cn(
            "h-4 w-4 shrink-0 opacity-50 transition-transform",
            isOpen && "rotate-180"
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && !isLoading && !error && locations.length > 0 && (
        <div
          className={cn(
            "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            "animate-in fade-in-80"
          )}
          role="listbox"
        >
          {locations.map((location) => {
            const isSelected = location.id === value

            return (
              <button
                key={location.id}
                type="button"
                onClick={() => handleLocationChange(location.id)}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "relative flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:bg-accent focus:text-accent-foreground",
                  isSelected && "bg-accent"
                )}
              >
                {showAvatar && (
                  <LocationAvatar name={location.name} logoUrl={location.logoUrl} />
                )}
                <div className="flex flex-1 flex-col items-start overflow-hidden">
                  <span className="truncate font-medium">{location.name}</span>
                  {location.address && (
                    <span className="truncate text-xs text-muted-foreground">
                      {location.address}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <svg
                    className="h-4 w-4 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

/**
 * Avatar component for location logo/icon.
 */
function LocationAvatar({
  name,
  logoUrl,
}: {
  name: string
  logoUrl?: string
}) {
  const initials = React.useMemo(() => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }, [name])

  return (
    <div
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted"
      aria-hidden="true"
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span className="text-xs font-medium text-muted-foreground">
          {initials}
        </span>
      )}
    </div>
  )
}
