"use client"

import { useGHLQuery } from "./use-ghl-query"
import type { GHLGetMessagesRequest, GHLMessage } from "@/registry/new-york/server/types/conversation"

/**
 * Parameters for fetching messages
 */
export interface UseGHLMessagesParams extends GHLGetMessagesRequest {}

/**
 * Hook to fetch messages for a conversation from GoHighLevel.
 * Supports pagination for loading older messages.
 *
 * @param params - Query parameters including conversationId, limit, etc.
 * @param options - Optional configuration for refetch interval and enabled state
 * @returns Query result with messages array, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * function MessageThread({ conversationId }: { conversationId: string }) {
 *   const { messages, isLoading, error, refetch } = useGHLMessages({
 *     conversationId,
 *     limit: 50
 *   })
 *
 *   if (isLoading) return <div>Loading messages...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <div>
 *       {messages.map(message => (
 *         <div key={message.id} className={message.direction}>
 *           {message.body}
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With auto-refetch for real-time updates
 * const { messages } = useGHLMessages(
 *   { conversationId: "conv123" },
 *   { refetchInterval: 5000 } // Poll every 5 seconds
 * )
 * ```
 */
export function useGHLMessages(
  params: UseGHLMessagesParams,
  options?: { refetchInterval?: number; enabled?: boolean }
) {
  const result = useGHLQuery(
    [
      "messages",
      params.conversationId,
      String(params.limit ?? ""),
      String(params.startAfter ?? ""),
      params.startAfterId ?? "",
    ],
    async (client) => {
      const response = await (client as unknown as {
        conversations: {
          getMessages: (params: GHLGetMessagesRequest) => Promise<{
            messages: GHLMessage[]
            lastMessageId?: string
          }>
        }
      }).conversations.getMessages(params)
      return response
    },
    {
      enabled: !!params.conversationId && (options?.enabled ?? true),
      ...options,
    }
  )

  // Extract messages from the result
  const messages = (result.data as { messages?: GHLMessage[] } | null)?.messages || []
  const lastMessageId = (result.data as { lastMessageId?: string } | null)?.lastMessageId

  return {
    ...result,
    messages,
    lastMessageId,
  }
}
