"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useGHLAuth } from "@/hooks/use-ghl-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york/ui/card"
import { cn } from "@/lib/utils"

interface GHLOAuthCallbackProps {
  /**
   * Redirect path after successful authentication.
   * @default "/dashboard"
   */
  redirectTo?: string

  /**
   * Callback fired when OAuth callback is successfully processed.
   */
  onSuccess?: () => void

  /**
   * Callback fired when OAuth callback fails.
   * @param error - The error that occurred
   */
  onError?: (error: Error) => void

  /**
   * Custom loading component.
   */
  loadingComponent?: React.ReactNode

  /**
   * Custom success component.
   */
  successComponent?: React.ReactNode

  /**
   * Custom error component.
   * @param error - The error that occurred
   */
  errorComponent?: (error: Error) => React.ReactNode

  /**
   * Additional CSS classes.
   */
  className?: string
}

type CallbackState = "loading" | "success" | "error"

/**
 * OAuth callback page handler component for GoHighLevel authentication.
 *
 * This component should be used on the OAuth callback route (e.g., `/auth/callback/ghl`).
 * It reads the authorization code from URL parameters, exchanges it for access tokens,
 * and handles success/error states.
 *
 * @example
 * ```tsx
 * // app/auth/callback/ghl/page.tsx
 * import { GHLOAuthCallback } from "@/registry/new-york/auth/ghl-oauth-callback"
 *
 * export default function OAuthCallbackPage() {
 *   return (
 *     <GHLOAuthCallback
 *       redirectTo="/dashboard"
 *       onSuccess={() => console.log("Authentication successful!")}
 *       onError={(error) => console.error("Authentication failed:", error)}
 *     />
 *   )
 * }
 * ```
 */
export function GHLOAuthCallback({
  redirectTo = "/dashboard",
  onSuccess,
  onError,
  loadingComponent,
  successComponent,
  errorComponent,
  className,
}: GHLOAuthCallbackProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { handleOAuthCallback } = useGHLAuth()

  const [state, setState] = React.useState<CallbackState>("loading")
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const processCallback = async () => {
      try {
        // Get authorization code from URL
        const code = searchParams.get("code")
        const error = searchParams.get("error")
        const errorDescription = searchParams.get("error_description")

        // Handle OAuth errors
        if (error) {
          const errorMsg = errorDescription || error
          throw new Error(`OAuth error: ${errorMsg}`)
        }

        // Validate code exists
        if (!code) {
          throw new Error("Missing authorization code in callback URL")
        }

        // Exchange code for tokens
        await handleOAuthCallback(code)

        setState("success")
        onSuccess?.()

        // Redirect after a brief delay to show success state
        setTimeout(() => {
          router.push(redirectTo)
        }, 1500)
      } catch (err) {
        const errorObj =
          err instanceof Error ? err : new Error("Failed to process OAuth callback")

        setState("error")
        setError(errorObj)
        onError?.(errorObj)
        console.error("OAuth callback error:", errorObj)
      }
    }

    processCallback()
  }, [searchParams, handleOAuthCallback, router, redirectTo, onSuccess, onError])

  // Render custom components if provided
  if (state === "loading" && loadingComponent) {
    return <>{loadingComponent}</>
  }

  if (state === "success" && successComponent) {
    return <>{successComponent}</>
  }

  if (state === "error" && error && errorComponent) {
    return <>{errorComponent(error)}</>
  }

  // Default UI
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center p-4",
        className
      )}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {state === "loading" && "Authenticating..."}
            {state === "success" && "Authentication Successful"}
            {state === "error" && "Authentication Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {state === "loading" && (
            <div className="space-y-3" role="status" aria-live="polite">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <p className="mt-4 text-sm text-muted-foreground">
                Please wait while we connect your account...
              </p>
            </div>
          )}

          {state === "success" && (
            <div role="status" aria-live="polite">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Your GoHighLevel account has been connected successfully.
                Redirecting...
              </p>
            </div>
          )}

          {state === "error" && error && (
            <div role="alert" aria-live="assertive">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="mb-2 font-medium text-destructive">
                Failed to connect your account
              </p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 text-sm text-primary underline-offset-4 hover:underline"
              >
                Return to home
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
