# GHL Hooks Implementation Guide

## Overview

Two generic hooks have been created to standardize all GoHighLevel API operations in the component registry:

1. **`hooks/use-ghl-query.ts`** - For data fetching (GET operations)
2. **`hooks/use-ghl-mutation.ts`** - For data mutations (POST/PUT/DELETE operations)

## Architecture

### useGHLQuery Hook

**Purpose**: Fetch and cache data from the GHL API

**Key Features**:
- Automatic caching (5-minute cache lifetime)
- Loading and error states
- Manual refetch capability
- Auto-refetch intervals
- Conditional query execution
- Success/error callbacks

**Return Values**:
- `data` - The fetched data (null if loading or error)
- `isLoading` - Boolean indicating loading state
- `error` - Error object if request failed
- `refetch` - Function to manually refetch data

**Cache Implementation**:
- Simple in-memory Map-based cache
- Cache key generated from query key array
- 5-minute cache lifetime (configurable via `CACHE_TIME`)
- Automatic cache invalidation on refetch

### useGHLMutation Hook

**Purpose**: Perform write operations to the GHL API

**Key Features**:
- Loading and error states
- Success/error/settled callbacks
- Query invalidation after successful mutation
- Two mutation methods: `mutate` (fire-and-forget) and `mutateAsync` (awaitable)
- Reset function to clear state

**Return Values**:
- `mutate` - Fire-and-forget mutation function
- `mutateAsync` - Awaitable mutation function (for sequential operations)
- `data` - Last mutation result
- `isLoading` - Boolean indicating mutation in progress
- `error` - Error object if mutation failed
- `reset` - Function to clear mutation state

## Design Decisions

### 1. Simple In-Memory Caching
Instead of using a complex library like React Query, we implemented a simple Map-based cache:
- Lightweight and easy to understand
- Sufficient for most use cases
- Can be extended later if needed

### 2. Query Key Pattern
Uses array-based query keys (e.g., `['contacts', locationId]`) that:
- Are easy to read and maintain
- Support hierarchical invalidation
- Mirror React Query's pattern for familiarity

### 3. No External Dependencies
Relies only on React hooks and the existing `useGHL` hook:
- Keeps bundle size small
- Reduces dependency maintenance
- Easier to customize

### 4. TypeScript Generics
Both hooks use generic types for flexibility:
```typescript
useGHLQuery<TData>
useGHLMutation<TData, TVariables>
```
This provides type safety while remaining flexible for any GHL API operation.

### 5. Separation of Concerns
- `useGHLQuery` - Read operations only
- `useGHLMutation` - Write operations only
- Clear separation makes code predictable and maintainable

## Implementation Details

### Query Cache Management

The cache is a module-level Map that persists across component renders:

```typescript
const queryCache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TIME = 5 * 60 * 1000 // 5 minutes
```

**Cache Key Generation**:
```typescript
const cacheKey = queryKey.join(":") // ['contacts', '123'] => 'contacts:123'
```

**Cache Invalidation**:
The `invalidateQueries` utility function supports pattern matching:
```typescript
// Invalidate all contact queries
invalidateQueries(['contacts'])

// Invalidate specific location contacts
invalidateQueries(['contacts', locationId])
```

### Query Lifecycle

1. Component mounts or dependencies change
2. Check if client is authenticated
3. Check cache for fresh data
4. If cache hit and fresh, return cached data
5. If cache miss or stale, fetch from API
6. Update cache and state
7. Set up refetch interval if specified
8. Clean up on unmount

### Mutation Lifecycle

1. User triggers mutation
2. Check if client is authenticated
3. Execute mutation function
4. On success:
   - Update state with result
   - Call `onSuccess` callback
   - Invalidate specified queries
   - Call `onSettled` callback
5. On error:
   - Update state with error
   - Call `onError` callback
   - Call `onSettled` callback

### Error Handling

Both hooks handle errors consistently:
- Errors are caught and stored in state
- Error callbacks are triggered
- Errors are typed as `Error | null`
- For mutations, errors are re-thrown in `mutateAsync`

### Memory Management

Both hooks implement proper cleanup:
- Use `useRef` for mounted state tracking
- Clear intervals on unmount
- Prevent state updates on unmounted components

## Integration with Existing Code

### Required Context

Both hooks depend on `useGHL()` which requires the component to be wrapped in `GHLProvider`:

```tsx
import { GHLProvider } from "@/registry/new-york/auth/ghl-provider"

<GHLProvider apiKey="your-api-key">
  <YourComponent />
</GHLProvider>
```

### Client Structure

The hooks receive a `HighLevel` client instance from the context:

```typescript
import type { HighLevel } from "@gohighlevel/api-client"

// The client has the following structure:
client.contacts.createContact(...)
client.contacts.searchContactsAdvanced(...)
client.conversations.getConversations(...)
// etc.
```

## Usage Patterns

### Basic Query
```typescript
const { data, isLoading, error } = useGHLQuery(
  ['contacts', locationId],
  (client) => client.contacts.searchContactsAdvanced({ locationId })
)
```

### Basic Mutation
```typescript
const { mutate, isLoading } = useGHLMutation(
  (client, input) => client.contacts.createContact(input),
  {
    onSuccess: () => toast.success('Created'),
    invalidateQueries: [['contacts']]
  }
)
```

### Sequential Mutations
```typescript
const { mutateAsync } = useGHLMutation(...)

for (const item of items) {
  await mutateAsync(item)
}
```

## Extension Points

The hooks can be extended with:

1. **Custom Cache Strategy**: Replace the Map-based cache with localStorage or IndexedDB
2. **Request Deduplication**: Add logic to prevent duplicate simultaneous requests
3. **Retry Logic**: Add automatic retry on failure
4. **Background Refetch**: Add window focus refetch
5. **Optimistic Updates**: Add helper methods for optimistic UI updates
6. **Middleware**: Add request/response interceptors

## Testing Considerations

When testing components using these hooks:

1. Mock the `useGHL` hook to return a fake client
2. Mock the API client methods
3. Test loading states by delaying promises
4. Test error states by rejecting promises
5. Test cache behavior with multiple renders

Example test setup:
```typescript
jest.mock('@/hooks/use-ghl', () => ({
  useGHL: () => ({
    client: {
      contacts: {
        searchContactsAdvanced: jest.fn().mockResolvedValue({ contacts: [] })
      }
    },
    isAuthenticated: true,
    isLoading: false,
    error: null
  })
}))
```

## Performance Considerations

1. **Cache Size**: The cache grows indefinitely. Consider adding a max size or LRU eviction
2. **Refetch Intervals**: Use sparingly to avoid excessive API calls
3. **Query Keys**: Keep query keys simple to avoid memory overhead
4. **Component Re-renders**: The hooks only trigger re-renders when state changes

## Migration Path

To migrate existing code to use these hooks:

1. Replace manual `useState` + `useEffect` patterns with `useGHLQuery`
2. Replace manual mutation handlers with `useGHLMutation`
3. Use query invalidation instead of manual refetch calls
4. Remove custom caching logic in favor of the built-in cache

## Future Enhancements

Potential improvements for future versions:

1. Persist cache to localStorage for offline support
2. Add request cancellation for stale requests
3. Add pagination helpers
4. Add infinite scroll support
5. Add DevTools for debugging queries and cache
6. Add query batching for multiple simultaneous requests
7. Add TypeScript type inference from GHL client methods
