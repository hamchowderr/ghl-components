import { NextRequest, NextResponse } from "next/server"

// Token exchange endpoint for GHL OAuth
// Called by use-ghl-auth.ts handleOAuthCallback()
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 }
      )
    }

    const clientId = process.env.NEXT_PUBLIC_GHL_CLIENT_ID
    const clientSecret = process.env.GHL_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_GHL_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: "Missing OAuth configuration" },
        { status: 500 }
      )
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch(
      "https://services.leadconnectorhq.com/oauth/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }),
      }
    )

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error("GHL token exchange failed:", errorData)
      return NextResponse.json(
        { error: "Token exchange failed" },
        { status: 502 }
      )
    }

    const tokens = await tokenResponse.json()
    return NextResponse.json(tokens)
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
