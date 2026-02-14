# Section 5: Security Vulnerability Audit

> Generated: 2026-02-14

## Executive Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 2 |
| Medium | 3 |
| Low | 2 |
| Info | 3 |

---

## Critical Findings

### CRIT-1: Client Secret Accessible in Client-Side Code

**File:** `registry/new-york/auth/ghl-provider.tsx:44`

```tsx
const finalClientSecret = clientSecret || process.env.GHL_CLIENT_SECRET
```

**Issue:** The `GHLProvider` component (marked `"use client"`) accepts `clientSecret` as a prop and falls back to `process.env.GHL_CLIENT_SECRET`. While `GHL_CLIENT_SECRET` (without `NEXT_PUBLIC_` prefix) is NOT bundled by Next.js, accepting it as a client component prop means a developer could inadvertently pass the secret from a server component, which would serialize it into the client-side HTML.

**Risk:** If a developer passes `clientSecret={process.env.GHL_CLIENT_SECRET}` from a server component, the secret gets serialized into the page HTML sent to the browser.

**Recommendation:**
- Remove the `clientSecret` prop from `GHLProvider`
- Move secret-dependent operations (token exchange, refresh) to server-side API routes
- The client should only handle the `clientId` (public) and communicate with server-side routes for token operations

---

## High Findings

### HIGH-1: TypeScript Type Checking Disabled During Build

**File:** `next.config.ts:7`

```ts
eslint: {
  ignoreDuringBuilds: true,
},
```

**Issue:** ESLint is skipped during builds. Combined with the `tsconfig.json` excludes (hooks, docs, stories), type errors in hooks are not caught. TypeScript type errors can mask security issues like incorrect type assertions on API responses.

**Recommendation:**
- Fix underlying TypeScript errors in hooks and components
- Remove `ignoreDuringBuilds: true` from next.config.ts
- Ensure CI pipeline catches type errors before deployment

### HIGH-2: Webhook Deduplication Uses In-Memory Set

**File:** `registry/new-york/server/webhook-handler.ts:14`

```ts
const processedWebhooks = new Set<string>()
```

**Issue:** The webhook deduplication relies on an in-memory `Set` which:
- Is lost on server restart/redeployment (Vercel serverless functions are ephemeral)
- Can grow unbounded (no TTL or size limit), leading to memory leaks
- Does not work across multiple serverless function instances

**Risk:** Duplicate webhooks will be processed after deployments. In a high-traffic scenario, the Set could consume significant memory.

**Recommendation:**
- Document that this is a basic deduplication mechanism
- For production use, recommend external storage (Redis, database) for webhook ID tracking
- Add a TTL-based cache with maximum size limit

---

## Medium Findings

### MED-1: No Input Sanitization on Webhook Payload Parsing

**File:** `registry/new-york/server/webhook-handler.ts:54`

```ts
const payload: GHLWebhookPayload = JSON.parse(rawBody)
```

**Issue:** The raw body is parsed with `JSON.parse` and cast directly to `GHLWebhookPayload`. There is no runtime validation that the parsed object actually matches the expected type shape. A malformed payload could cause undefined behavior in handlers.

**Recommendation:**
- Add Zod schema validation for webhook payloads before routing
- Validate that required fields (`type`, `webhookId`, `data`) exist before processing

### MED-2: Error Response Leaks Processing Status

**File:** `registry/new-york/server/webhook-handler.ts:68`

```ts
return NextResponse.json({ success: false, error: "Processing failed" }, { status: 200 })
```

**Issue:** Returns 200 even on error, which is intentional (GHL expects 200), but the error message in the response body could inform attackers about internal processing failures. The `console.error` also logs the full error object which could contain sensitive information in production logs.

**Recommendation:**
- Return a generic response body on errors (already mostly done)
- Ensure production logging does not include full stack traces or sensitive data

### MED-3: Placeholder GitHub URL in Production

**File:** `app/page.tsx:30`

```tsx
href="https://github.com/your-org/ghl-components"
```

**Issue:** A placeholder URL is shipped in production code. This could be misleading to users and is a signal of incomplete production readiness.

**Recommendation:**
- Replace with actual repository URL or remove the link

---

## Low Findings

### LOW-1: No Rate Limiting on Registry Endpoints

**Issue:** The `/r/*.json` registry endpoints have CORS set to `*` (any origin) and no rate limiting. While these serve static JSON files, they could be targeted for abuse.

**Recommendation:**
- Vercel provides edge-level DDoS protection by default
- Consider adding rate limiting via Vercel Edge Middleware if abuse is observed
- The `Cache-Control: public, max-age=3600, s-maxage=86400` header helps by enabling CDN caching

### LOW-2: No Content Security Policy (CSP) Headers

**Issue:** No CSP headers configured in `vercel.json` or Next.js middleware. CSP helps prevent XSS attacks.

**Recommendation:**
- Add basic CSP headers for the landing page
- This is less critical since the app primarily serves JSON registry files

---

## Informational Findings

### INFO-1: GHL Public Key Embedded in Source

**File:** `registry/new-york/server/constants.ts:6-19`

**Status:** Safe. This is a _public_ key used for webhook signature verification. It is meant to be public.

### INFO-2: NEXT_PUBLIC_ Prefixed Variables

| Variable | Exposure | Assessment |
|----------|----------|------------|
| `NEXT_PUBLIC_GHL_CLIENT_ID` | Browser | **Safe** - Client IDs are public in OAuth flows |
| `NEXT_PUBLIC_GHL_REDIRECT_URI` | Browser | **Safe** - Redirect URIs are public |
| `GHL_CLIENT_SECRET` | Server only | **OK** - No `NEXT_PUBLIC_` prefix |
| `GHL_LOCATION_ID` | Server only | **OK** - No `NEXT_PUBLIC_` prefix |

### INFO-3: No SSRF Attack Surface Detected

The codebase does not construct URLs from user input for server-side requests. The GHL API base URL is hardcoded in `constants.ts`. No SSRF risk identified.

---

## Dependency Audit

### Key Dependencies and Their Security Posture

| Package | Version | Known Vulnerabilities | Notes |
|---------|---------|----------------------|-------|
| `next` | ^15.5.11 | Patched (CVE-2025-55182 fixed) | Upgraded in commit `e0b0dca` |
| `react` | ^19.0.0 | RSC CVE patched | Fixed in commit `cdfa0e5` |
| `zod` | ^4.3.6 | None known | Input validation library |
| `@gohighlevel/api-client` | ^2.2.2 | Unknown | Official GHL package |

**Recommendation:** Run `npm audit` regularly and integrate into CI. Consider using `npm audit --production` to focus on runtime dependencies.

---

## Authentication & Authorization Assessment

| Area | Status | Notes |
|------|--------|-------|
| OAuth 2.0 flow | Implemented | Uses GHL SDK, proper state parameter for CSRF |
| Token storage | In-memory | `MemorySessionStorage` - tokens lost on refresh |
| Token refresh | Implemented | Via GHL SDK auto-refresh |
| CSRF protection | Present | `useGHLAuth` generates random state parameter |
| API route protection | Not applicable | No custom API routes (registry serves static JSON) |

---

## Recommendations Summary (Prioritized)

1. **[Critical]** Remove `clientSecret` prop from `GHLProvider` or move token operations server-side
2. **[High]** Fix TypeScript errors and re-enable type checking during builds
3. **[High]** Document webhook deduplication limitations; recommend persistent storage for production
4. **[Medium]** Add Zod validation for webhook payload parsing
5. **[Medium]** Replace placeholder GitHub URL
6. **[Low]** Add CSP headers
7. **[Routine]** Run `npm audit` in CI pipeline
