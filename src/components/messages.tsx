import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

import { getRoomMessages } from "../http/get-room-messages"
import { Message } from "./message"

export function Messages() {
  const { roomId } = useParams()

  if (!roomId) {
    throw new Error("Messages components must be used within room page")
  }

  const { data } = useSuspenseQuery({
    queryFn: () => getRoomMessages({ roomId }),
    queryKey: ["messages", roomId],
  })

  return (
    <ol className="list-decimal px-3 space-y-8">
      {data?.messages?.map(message => (
        <Message
          key={message.id}
          id={message.id}
          text={message.message}
          reactionCount={message.reactionCount}
          answered={message.answered}
        />
      ))}
    </ol>
  )
}
