"use client"

import { useGHLQuery } from "./use-ghl-query"
import type { GHLGetConversationsRequest, GHLConversation } from "@/registry/new-york/server/types/conversation"

/**
 * Parameters for listing conversations
 */
export interface UseGHLConversationsParams extends GHLGetConversationsRequest {}

/**
 * Hook to list conversations from a GoHighLevel location.
 * Wraps the conversations API with pagination support.
 *
 * @param params - Query parameters including locationId, status, limit, etc.
 * @param options - Optional configuration for refetch interval and enabled state
 * @returns Query result with conversations array, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function ConversationsInbox() {
 *   const { conversations, isLoading, error, refetch } = useGHLConversations({
 *     locationId: "abc123",
 *     status: "unread",
 *     limit: 25
 *   })
 *
 *   if (isLoading) return <div>Loading conversations...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <div>
 *       <button onClick={() => refetch()}>Refresh</button>
 *       {conversations.map(conv => (
 *         <div key={conv.id}>
 *           {conv.contactName}: {conv.lastMessageBody}
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Filter by assigned user with auto-refetch
 * const { conversations } = useGHLConversations(
 *   { locationId: "abc123", assignedTo: "user456" },
 *   { refetchInterval: 10000 }
 * )
 * ```
 */
export function useGHLConversations(
  params: UseGHLConversationsParams,
  options?: { refetchInterval?: number; enabled?: boolean }
) {
  const result = useGHLQuery(
    [
      "conversations",
      params.locationId,
      params.contactId ?? "",
      params.assignedTo ?? "",
      params.status ?? "",
      String(params.limit ?? ""),
      String(params.startAfter ?? ""),
      params.startAfterId ?? "",
    ],
    async (client) => {
      // Use the conversations API endpoint
      const response = await (client as unknown as {
        conversations: {
          getConversations: (params: GHLGetConversationsRequest) => Promise<{
            conversations: GHLConversation[]
            total?: number
          }>
        }
      }).conversations.getConversations(params)
      return response
    },
    {
      enabled: !!params.locationId && (options?.enabled ?? true),
      ...options,
    }
  )

  // Extract conversations from the result
  const conversations = (result.data as { conversations?: GHLConversation[] } | null)?.conversations || []
  const total = (result.data as { total?: number } | null)?.total

  return {
    ...result,
    conversations,
    total,
  }
}
