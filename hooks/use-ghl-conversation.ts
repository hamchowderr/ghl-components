"use client"

import { useGHLQuery } from "./use-ghl-query"
import type { GHLConversation } from "@/registry/new-york/server/types/conversation"

/**
 * Hook to fetch a single conversation by ID from GoHighLevel.
 *
 * @param conversationId - The unique identifier of the conversation to fetch
 * @param options - Optional configuration for refetch interval and enabled state
 * @returns Query result with conversation object, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function ConversationDetail({ id }: { id: string }) {
 *   const { conversation, isLoading, error, refetch } = useGHLConversation(id)
 *
 *   if (isLoading) return <div>Loading conversation...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *   if (!conversation) return <div>Conversation not found</div>
 *
 *   return (
 *     <div>
 *       <h1>Chat with {conversation.contactName}</h1>
 *       <p>Last message: {conversation.lastMessageBody}</p>
 *       <p>Unread: {conversation.unreadCount}</p>
 *       <button onClick={() => refetch()}>Refresh</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Conditionally fetch conversation
 * const conversationId = useParams().id
 * const { conversation } = useGHLConversation(conversationId, {
 *   enabled: !!conversationId
 * })
 * ```
 */
export function useGHLConversation(
  conversationId: string | undefined,
  options?: { refetchInterval?: number; enabled?: boolean }
) {
  const result = useGHLQuery(
    ["conversation", conversationId ?? ""],
    async (client) => {
      const response = await (client as unknown as {
        conversations: {
          getConversation: (params: { conversationId: string }) => Promise<{
            conversation: GHLConversation
          }>
        }
      }).conversations.getConversation({ conversationId: conversationId! })
      return response
    },
    {
      enabled: !!conversationId && (options?.enabled ?? true),
      ...options,
    }
  )

  const conversation = (result.data as { conversation?: GHLConversation } | null)?.conversation

  return {
    ...result,
    conversation,
  }
}
