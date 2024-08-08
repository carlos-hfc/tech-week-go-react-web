import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

import { GetRoomMessagesResponse } from "../http/get-room-messages"

interface UseMessagesWebsocketsParams {
  roomId: string
}

type MessageWebSocket =
  | { kind: "message_created"; value: { id: string; message: string } }
  | { kind: "message_answered"; value: { id: string } }
  | { kind: "message_reaction_decreased"; value: { id: string; count: number } }
  | { kind: "message_reaction_increased"; value: { id: string; count: number } }

export function useMessagesWebsockets({ roomId }: UseMessagesWebsocketsParams) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`)

    ws.onopen = () => console.log("WebSocket connected!")
    ws.onclose = () => console.log("WebSocket closed!")

    ws.onmessage = event => {
      const data: MessageWebSocket = JSON.parse(event.data)

      switch (data.kind) {
        case "message_created":
          queryClient.setQueryData<GetRoomMessagesResponse>(
            ["messages", roomId],
            prevState => {
              return {
                messages: [
                  ...(prevState?.messages ?? []),
                  {
                    id: data.value.id,
                    message: data.value.message,
                    reactionCount: 0,
                    answered: false,
                  },
                ],
              }
            },
          )
          break
        case "message_answered":
          queryClient.setQueryData<GetRoomMessagesResponse>(
            ["messages", roomId],
            prevState => {
              if (!prevState) {
                return undefined
              }

              return {
                messages: prevState.messages.map(item => {
                  if (item.id === data.value.id) {
                    return {
                      ...item,
                      answered: true,
                    }
                  }

                  return item
                }),
              }
            },
          )
          break
        case "message_reaction_increased":
        case "message_reaction_decreased":
          queryClient.setQueryData<GetRoomMessagesResponse>(
            ["messages", roomId],
            prevState => {
              if (!prevState) {
                return undefined
              }

              return {
                messages: prevState.messages.map(item => {
                  if (item.id === data.value.id) {
                    return {
                      ...item,
                      reactionCount: data.value.count,
                    }
                  }

                  return item
                }),
              }
            },
          )
          break
      }
    }

    return () => ws.close()
  }, [roomId, queryClient])
}
