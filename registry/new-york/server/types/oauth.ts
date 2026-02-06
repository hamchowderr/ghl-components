// GHL OAuth Types

export interface GHLOAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: GHLScope[]
}

export type GHLScope =
  | "contacts.readonly"
  | "contacts.write"
  | "calendars.readonly"
  | "calendars.write"
  | "calendars/events.readonly"
  | "calendars/events.write"
  | "conversations.readonly"
  | "conversations.write"
  | "conversations/message.readonly"
  | "conversations/message.write"
  | "opportunities.readonly"
  | "opportunities.write"
  | "campaigns.readonly"
  | "workflows.readonly"
  | "locations.readonly"
  | "locations.write"
  | "users.readonly"
  | "users.write"

export interface GHLAuthorizationParams {
  response_type: "code"
  client_id: string
  redirect_uri: string
  scope: string
  state?: string
}

export interface GHLTokenRequest {
  client_id: string
  client_secret: string
  grant_type: "authorization_code" | "refresh_token"
  code?: string
  refresh_token?: string
  redirect_uri?: string
}

export interface GHLTokenResponse {
  access_token: string
  token_type: "Bearer"
  expires_in: number
  refresh_token: string
  scope: string
  userType: "Location" | "Company"
  companyId: string
  locationId?: string
  userId?: string
  traceId?: string
}

export interface GHLAuthState {
  isAuthenticated: boolean
  isLoading: boolean
  accessToken?: string
  refreshToken?: string
  expiresAt?: number
  userType?: "Location" | "Company"
  companyId?: string
  locationId?: string
  userId?: string
  scopes?: string[]
}

export interface GHLLocation {
  id: string
  name: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  phone?: string
  email?: string
  website?: string
  timezone?: string
  logoUrl?: string
}

export interface GHLUser {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  permissions: string[]
}

export const GHL_OAUTH_BASE_URL = "https://marketplace.gohighlevel.com/oauth/chooselocation"
export const GHL_TOKEN_URL = "https://services.leadconnectorhq.com/oauth/token"
