"use client"

import * as React from "react"
import { useGHLAuth } from "@/hooks/use-ghl-auth"
import { Button } from "@/registry/new-york/ui/button"
import { cn } from "@/lib/utils"

interface GHLConnectButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * OAuth scopes to request from GoHighLevel.
   * @example ["contacts.readonly", "calendars.write", "opportunities.readonly"]
   */
  scopes: string[]

  /**
   * Callback fired when OAuth flow is successfully initiated.
   */
  onSuccess?: () => void

  /**
   * Callback fired when OAuth initiation fails.
   * @param error - The error that occurred
   */
  onError?: (error: Error) => void

  /**
   * Button text content.
   * @default "Connect to GoHighLevel"
   */
  children?: React.ReactNode
}

/**
 * Button component that triggers the GoHighLevel OAuth flow.
 *
 * This component handles the OAuth initiation process, including error states
 * and loading states. When clicked, it redirects the user to GoHighLevel's
 * OAuth authorization page.
 *
 * @example
 * ```tsx
 * <GHLConnectButton
 *   scopes={["contacts.readonly", "calendars.readonly"]}
 *   onSuccess={() => console.log("OAuth started")}
 *   onError={(error) => console.error("OAuth failed:", error)}
 * >
 *   Connect Your Account
 * </GHLConnectButton>
 * ```
 */
export function GHLConnectButton({
  scopes,
  onSuccess,
  onError,
  children = "Connect to GoHighLevel",
  className,
  disabled,
  ...props
}: GHLConnectButtonProps) {
  const { initiateOAuth, isLoading } = useGHLAuth()
  const [isInitiating, setIsInitiating] = React.useState(false)

  const handleConnect = React.useCallback(async () => {
    if (!scopes || scopes.length === 0) {
      const error = new Error("At least one OAuth scope must be provided")
      onError?.(error)
      console.error("GHLConnectButton: No scopes provided")
      return
    }

    setIsInitiating(true)

    try {
      await initiateOAuth(scopes)
      onSuccess?.()
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error("Failed to initiate OAuth")
      onError?.(errorObj)
      console.error("Failed to initiate OAuth:", errorObj)
    } finally {
      setIsInitiating(false)
    }
  }, [scopes, initiateOAuth, onSuccess, onError])

  const isDisabled = disabled || isLoading || isInitiating

  return (
    <Button
      onClick={handleConnect}
      disabled={isDisabled}
      className={cn(className)}
      aria-label="Connect to GoHighLevel"
      aria-busy={isInitiating}
      {...props}
    >
      {isInitiating ? "Connecting..." : children}
    </Button>
  )
}
