# Section 1: Environment & Deployment Pipeline

> Generated: 2026-02-14

## Detected Platform: Vercel

### Evidence
- `vercel.json` present with Next.js framework config
- `.vercel` in `.gitignore`
- Homepage URL: `https://ghl-components.vercel.app`
- No Dockerfile, `netlify.toml`, `fly.toml`, `railway.json`, or `render.yaml` found

---

## Three-Tier Deployment Pipeline

### Local (Development)
```
Branch: any feature branch
URL: http://localhost:3000
Command: npm run dev
```
- Developer works locally with `.env.local` for environment variables
- Run `npm run validate-env` to verify environment variable configuration
- Run `npm run lint`, `npx tsc --noEmit`, and `npm test` before pushing

### Preview/Staging (Vercel Preview Deployments)
```
Branch: any PR branch → main or staging
URL: https://ghl-components-<hash>.vercel.app (auto-generated per PR)
Trigger: Pull request opened or updated
```
- Vercel automatically creates preview deployments for every PR
- `vercel.json` already enables deployments for `main` and `staging` branches
- CI pipeline runs lint, typecheck, unit tests, build, E2E tests, and registry validation
- Preview URL is posted as a comment on the PR

### Production
```
Branch: main
URL: https://ghl-components.vercel.app
Trigger: Merge to main
```
- Auto-deploys when PRs merge to `main`
- Branch protection (recommended) prevents direct pushes
- All CI checks must pass before merge

---

## Deployment Flow

```
Developer Branch
    │
    ├─► Push to origin
    │
    ├─► PR opened → main or staging
    │      │
    │      ├─► GitHub Actions CI runs:
    │      │     ├── Lint (ESLint)
    │      │     ├── Type Check (tsc --noEmit)
    │      │     ├── Unit Tests (vitest)
    │      │     ├── Build (shadcn build + next build)
    │      │     ├── E2E Tests (Playwright)
    │      │     └── Registry Validation
    │      │
    │      ├─► Vercel Preview Deployment
    │      │     └── Preview URL posted to PR
    │      │
    │      └─► Review + Approve PR
    │
    └─► Merge to main
           │
           └─► Vercel Production Deployment
                 └── https://ghl-components.vercel.app
```

---

## Environment Variable Scoping

| Variable | Local (.env.local) | Preview (Vercel) | Production (Vercel) |
|----------|-------------------|-----------------|-------------------|
| `NEXT_PUBLIC_GHL_CLIENT_ID` | Dev app ID | Staging app ID | Production app ID |
| `GHL_CLIENT_SECRET` | Dev secret | Staging secret | Production secret |
| `NEXT_PUBLIC_GHL_REDIRECT_URI` | `http://localhost:3000/api/auth/callback/ghl` | Preview URL callback | `https://ghl-components.vercel.app/api/auth/callback/ghl` |
| `GHL_LOCATION_ID` | Dev location | Staging location | Production location |

### Setting Environment Variables in Vercel

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. For each variable, set scoping:
   - **Production**: Only for `main` branch deployments
   - **Preview**: For all PR preview deployments
   - **Development**: For `vercel dev` local usage
3. Sensitive secrets (`GHL_CLIENT_SECRET`) should NEVER use `NEXT_PUBLIC_` prefix

---

## Current Configuration Analysis

### vercel.json
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm ci",
  "git": {
    "deploymentEnabled": {
      "main": true,
      "staging": true
    }
  },
  "headers": [
    {
      "source": "/r/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, OPTIONS" },
        { "key": "Cache-Control", "value": "public, max-age=3600, s-maxage=86400" }
      ]
    }
  ]
}
```

**Assessment:** Well-configured. Registry endpoints have proper CORS headers and caching. Both `main` and `staging` branches are deployment-enabled.

### Recommendations

1. **Branch Protection:** Set up GitHub branch protection rules on `main` (see Section 6B report)
2. **Separate GHL Apps:** Use different GHL Marketplace apps for staging vs. production to avoid data cross-contamination
3. **Preview Environment Vars:** Configure preview-specific OAuth redirect URIs in Vercel that use the preview URL
4. **Staging Branch:** Consider using the `staging` branch for QA testing before merging to `main`
