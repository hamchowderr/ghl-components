"use client"

import { useGHLMutation } from "./use-ghl-mutation"
import type { GHLSendMessageRequest, GHLMessage } from "@/registry/new-york/server/types/conversation"

/**
 * Hook for sending messages through GoHighLevel.
 * Supports SMS, Email, WhatsApp, Facebook, Instagram, and other channels.
 *
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, loading state, and error
 *
 * @example
 * ```tsx
 * function MessageComposer({ contactId }: { contactId: string }) {
 *   const [message, setMessage] = useState("")
 *   const { mutate, isLoading, error } = useGHLSendMessage({
 *     onSuccess: () => {
 *       toast.success("Message sent!")
 *       setMessage("")
 *     },
 *     onError: (error) => {
 *       toast.error(`Failed to send: ${error.message}`)
 *     },
 *     invalidateQueries: [["messages"]]
 *   })
 *
 *   const handleSend = () => {
 *     mutate({
 *       type: "SMS",
 *       contactId,
 *       message
 *     })
 *   }
 *
 *   return (
 *     <div>
 *       <textarea
 *         value={message}
 *         onChange={(e) => setMessage(e.target.value)}
 *         disabled={isLoading}
 *       />
 *       <button onClick={handleSend} disabled={isLoading || !message}>
 *         {isLoading ? "Sending..." : "Send"}
 *       </button>
 *       {error && <p className="error">{error.message}</p>}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Sending an email
 * mutate({
 *   type: "Email",
 *   contactId: "contact123",
 *   message: "<p>Hello!</p>",
 *   subject: "Important Update",
 *   emailFrom: "hello@example.com"
 * })
 * ```
 *
 * @example
 * ```tsx
 * // Using mutateAsync for sequential operations
 * const { mutateAsync } = useGHLSendMessage()
 *
 * async function sendBulkMessages(contacts: string[], message: string) {
 *   for (const contactId of contacts) {
 *     await mutateAsync({ type: "SMS", contactId, message })
 *   }
 * }
 * ```
 */
export function useGHLSendMessage(options?: {
  onSuccess?: (data: GHLMessage, variables: GHLSendMessageRequest) => void
  onError?: (error: Error, variables: GHLSendMessageRequest) => void
  onSettled?: (
    data: GHLMessage | null,
    error: Error | null,
    variables: GHLSendMessageRequest
  ) => void
  invalidateQueries?: string[][]
}) {
  return useGHLMutation<GHLMessage, GHLSendMessageRequest>(
    async (client, variables) => {
      const response = await (client as unknown as {
        conversations: {
          sendMessage: (params: GHLSendMessageRequest) => Promise<{
            message: GHLMessage
          }>
        }
      }).conversations.sendMessage(variables)
      return response.message
    },
    options
  )
}
