# Section 2: Git History Audit & Recovery

> Generated: 2026-02-14

## Commit Timeline (Oldest → Newest)

| # | Commit | Type | Description | Notes |
|---|--------|------|-------------|-------|
| 1 | `dad420f` | Config | Initial commit | shadcn registry-template scaffold |
| 2 | `19cfcf2` | Config | Update Next.js | Framework upgrade |
| 3 | `dc8bf65` | Feature | Add example with CSS | Template example component |
| 4 | `0d4929b` | Feature | Add registry.json | Core registry infrastructure |
| 5 | `2c70baa` | Fix | Replace local shadcn CLI reference with 'shadcn build' | External contribution (PR #1 from trm217) |
| 6 | `d9372b9` | Merge | Merge PR #1 | Merged fix from trm217 |
| 7 | `b89c087` | Dependency | Update dependencies | Routine update |
| 8 | `6e73712` | Dependency | Update dependencies | Routine update |
| 9 | `6e04859` | Docs | Update README | Documentation |
| 10 | `664647c` | Merge | Merge branch 'main' of registry-template | Sync with upstream template |
| 11 | `e0b0dca` | Security Fix | Upgrade Next.js to 15.5.7 (CVE-2025-55182) | **Critical security patch** |
| 12 | `e7322e7` | Merge | Merge PR #13 | Security fix merged |
| 13 | `cdfa0e5` | Security Fix | Fix React Server Components CVE | **Security patch** |
| 14 | `906f859` | Merge | Merge PR #15 | Security fix merged |
| 15 | `ea487ce` | Feature | GHL Components registry with full test suite | **Major: Full GHL component implementation** |
| 16 | `628fa47` | Config | Update pnpm lockfile for Vercel deployment | Deployment fix |
| 17 | `4ef53b2` | Fix | Update GHLProvider props in docs examples | Documentation accuracy |
| 18 | `a5bda49` | Config | Exclude docs folder from TypeScript checking | Build fix |
| 19 | `3654124` | Fix | Update OAuth hook to use standard patterns | API fix |
| 20 | `31cfec0` | Config | Exclude hooks from TypeScript checking | Build workaround |
| 21 | `ca65115` | Config | Skip TypeScript and ESLint errors during build | **Build workaround - tech debt** |
| 22 | `7fb77cc` | Feature | Complete component registry with opportunities, conversations, and showcase | **Major: Phase 4 & 5 components** |
| 23 | `edfb491` | Fix | Sync package-lock.json and improve CI/CD setup | Infrastructure fix |

## Timeline Summary

**Phase 1 (Commits 1-10):** Template scaffolding from shadcn/ui registry-template. Upstream template with basic examples.

**Phase 2 (Commits 11-14):** Security patches for Next.js CVE-2025-55182 and React Server Components vulnerabilities. These came via PRs, indicating some level of review process.

**Phase 3 (Commit 15):** Single massive commit (`ea487ce`) containing the entire GHL component implementation - auth, contacts, calendars, server utilities, types, hooks, and tests. This is where the bulk of the project's code was introduced.

**Phase 4 (Commits 16-23):** Iterative fixes to get the build passing on Vercel. Multiple commits progressively exclude code from TypeScript checking to work around type errors, culminating in skipping TS/ESLint entirely during build (`ca65115`). Then another major feature commit (`7fb77cc`) adding opportunities, conversations, and the landing page showcase.

## Key Findings

### 1. Monolithic Feature Commits
Two commits (`ea487ce` and `7fb77cc`) contain the vast majority of the project's code. This makes it impossible to trace individual features to specific commits and makes rollback difficult if issues are found.

### 2. Progressive Build Workarounds (Commits 17-21)
A pattern of progressively disabling type checking to get the build passing, rather than fixing the underlying type errors:
- `a5bda49`: Excluded docs from TS checking
- `31cfec0`: Excluded hooks from TS checking
- `ca65115`: Skipped TS and ESLint errors entirely during build

**Impact:** TypeScript errors may be hiding real bugs. The build "passes" but types are not being validated.

### 3. No Reverted or Contradictory Commits
No commits were found that revert previous changes.

### 4. Security Patches Were Merged via PRs
Commits 11-14 show that security patches came through pull requests (#13, #15), indicating at least some review process was in place for those changes.

### 5. Direct-to-Main Pushes
The majority of feature and fix commits appear to have been pushed directly to main without pull requests.

## Secret Leak Scan

### .gitignore Analysis
`.gitignore` was present from early commits and includes `.env`, `.env.local`, and `.env.*.local`. This provides baseline protection.

### Findings
Based on code analysis of the repository:

| Finding | Severity | Details |
|---------|----------|--------|
| `GHL_PUBLIC_KEY` in constants.ts | **Low** | This is a *public* key for webhook verification - safe to embed |
| `GHL_CLIENT_SECRET` referenced in code | **Info** | Referenced via `process.env.GHL_CLIENT_SECRET` - not hardcoded |
| `NEXT_PUBLIC_GHL_CLIENT_ID` in code | **Info** | Properly marked as public via `NEXT_PUBLIC_` prefix |
| No `.env` files committed | **OK** | `.gitignore` correctly excludes env files |

### Recommendations
1. **Rotate any secrets** that may have been exposed during development if the repo was ever public
2. **Run `gitleaks` or `trufflehog`** against the full git history for a comprehensive scan (requires local tooling)
3. **Verify no env files were committed and later removed** by checking `git log --all --diff-filter=D -- '.env*'`

## Commits Requiring E2E Coverage

| Commit | Feature Area | E2E Tests Needed |
|--------|-------------|-----------------|
| `ea487ce` | OAuth flow, Contact components, Calendar components, Webhook handler | Auth flow tests, Contact CRUD tests, Calendar/booking tests, Webhook verification tests |
| `7fb77cc` | Opportunity/Pipeline components, Conversation components, Landing page showcase | Pipeline board tests, Conversation/messaging tests, Landing page tests |

## Risk Assessment

| Risk | Level | Description |
|------|-------|-------------|
| Build stability | **High** | TypeScript errors are suppressed, not fixed |
| Feature traceability | **Medium** | Monolithic commits make individual feature tracking difficult |
| Rollback capability | **Medium** | Large commits mean all-or-nothing rollbacks |
| Secret exposure | **Low** | .gitignore was in place; no hardcoded secrets found in code |
