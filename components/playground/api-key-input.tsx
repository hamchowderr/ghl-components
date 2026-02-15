"use client"

import * as React from "react"
import { usePlayground } from "./playground-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, Unplug, Eye, EyeOff, Loader2 } from "lucide-react"

export function ApiKeyInput() {
  const { mode, isConnected, setCredentials, disconnect } = usePlayground()
  const [token, setToken] = React.useState("")
  const [locationId, setLocationId] = React.useState("")
  const [showToken, setShowToken] = React.useState(false)
  const [isValidating, setIsValidating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleConnect = async () => {
    if (!token.trim() || !locationId.trim()) {
      setError("Both fields are required")
      return
    }

    setIsValidating(true)
    setError(null)

    // Set credentials first so fetchGHL has them
    setCredentials(token.trim(), locationId.trim())

    // Validate by making a test call
    try {
      const url = new URL("/api/playground/contacts/", window.location.origin)
      url.searchParams.set("locationId", locationId.trim())
      url.searchParams.set("limit", "1")

      const response = await fetch(url.toString(), {
        headers: { "x-ghl-token": token.trim() },
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || data.error || `Invalid credentials (${response.status})`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed")
      disconnect()
    } finally {
      setIsValidating(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setToken("")
    setLocationId("")
    setError(null)
  }

  if (isConnected && mode === "live") {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
        <Badge variant="default" className="gap-1.5 bg-green-600 hover:bg-green-600">
          <Check className="h-3 w-3" />
          Connected
        </Badge>
        <span className="text-sm text-muted-foreground">
          Live data from your GHL account
        </span>
        <Button variant="ghost" size="sm" onClick={handleDisconnect} className="ml-auto gap-1.5">
          <Unplug className="h-3.5 w-3.5" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 rounded-lg border bg-card">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">Connect Your GHL Account</h3>
        <p className="text-xs text-muted-foreground">
          Enter your Private Integration Token and Location ID to see components with real data.
          Your token is stored in your browser session only and is never saved on our servers.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ghl-token" className="text-xs">
            Private Integration Token
          </Label>
          <div className="relative">
            <Input
              id="ghl-token"
              type={showToken ? "text" : "password"}
              placeholder="pit-xxxxxxxx..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="pr-9 font-mono text-xs"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full w-9 hover:bg-transparent"
              onClick={() => setShowToken(!showToken)}
              type="button"
            >
              {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ghl-location" className="text-xs">
            Location ID
          </Label>
          <Input
            id="ghl-location"
            placeholder="xxxxxxxxxxxxxxxx"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="font-mono text-xs"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      <Button
        onClick={handleConnect}
        disabled={isValidating || !token.trim() || !locationId.trim()}
        size="sm"
        className="w-full sm:w-auto"
      >
        {isValidating ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Validating...
          </>
        ) : (
          "Connect"
        )}
      </Button>
    </div>
  )
}
