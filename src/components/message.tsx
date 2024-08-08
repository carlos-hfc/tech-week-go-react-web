import { ArrowUpIcon } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

import { createMessageReaction } from "../http/create-message-reaction"
import { removeMessageReaction } from "../http/remove-message-reaction"

interface MessageProps {
  id: string
  text: string
  reactionCount: number
  answered?: boolean
}

export function Message({
  text,
  reactionCount,
  id: messageId,
  answered = false,
}: MessageProps) {
  const { roomId } = useParams()

  if (!roomId) {
    throw new Error("Messages components must be used within room page")
  }

  const [hasReacted, setHasReacted] = useState(false)

  async function handleReactToMessage(reaction: boolean) {
    if (!roomId) return

    setHasReacted(reaction)

    try {
      if (reaction) {
        await createMessageReaction({ messageId, roomId })
      } else {
        await removeMessageReaction({ messageId, roomId })
      }
    } catch (error) {
      toast.error("Falha ao reagir à mensagem!")
    }
  }
  return (
    <li
      className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none"
      data-answered={answered}
    >
      {text}
      <button
        type="button"
        onClick={() => handleReactToMessage(!hasReacted)}
        className={`mt-3 flex items-center gap-2 text-sm font-medium  ${hasReacted ? "text-orange-300 hover:text-orange-500" : "text-zinc-400 hover:text-zinc-300"}`}
      >
        <ArrowUpIcon className="size-4" />
        Curtir pergunta ({reactionCount})
      </button>
    </li>
  )
}
