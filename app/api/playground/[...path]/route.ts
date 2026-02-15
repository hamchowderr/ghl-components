import { NextRequest, NextResponse } from "next/server"

const GHL_BASE_URL = "https://services.leadconnectorhq.com"
const GHL_API_VERSION = "2021-07-28"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

async function proxyRequest(
  request: NextRequest,
  { path }: { path: string[] }
) {
  const token = request.headers.get("x-ghl-token")

  if (!token) {
    return NextResponse.json(
      { error: "Missing x-ghl-token header" },
      { status: 401 }
    )
  }

  const ghlPath = "/" + path.join("/")
  const url = new URL(ghlPath, GHL_BASE_URL)

  // Forward query parameters
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Version: GHL_API_VERSION,
    "Content-Type": "application/json",
  }

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  }

  if (request.method === "POST") {
    try {
      const body = await request.json()
      fetchOptions.body = JSON.stringify(body)
    } catch {
      // No body
    }
  }

  try {
    const response = await fetch(url.toString(), fetchOptions)
    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Proxy request failed" },
      { status: 502 }
    )
  }
}
