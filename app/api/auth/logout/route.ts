import { NextResponse } from "next/server"

// Logout endpoint for GHL OAuth
// Called by use-ghl-auth.ts logout()
// With MemorySessionStorage, server-side state is ephemeral.
// For persistent storage (cookies, DB), add cleanup logic here.
export async function POST() {
  return NextResponse.json({ success: true })
}
