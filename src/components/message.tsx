import { ArrowUpIcon } from "lucide-react"
import { useState } from "react"

interface MessageProps {
  text: string
  reactionCount: number
  answered?: boolean
}

export function Message({
  text,
  reactionCount,
  answered = false,
}: MessageProps) {
  const [hasReacted, setHasReacted] = useState(false)

  async function handleReactToMessage() {
    setHasReacted(prev => !prev)
  }

  return (
    <li
      className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none"
      data-answered={answered}
    >
      {text}
      <button
        type="button"
        onClick={handleReactToMessage}
        className={`mt-3 flex items-center gap-2 text-sm font-medium  ${hasReacted ? "text-orange-300 hover:text-orange-500" : "text-zinc-400 hover:text-zinc-300"}`}
      >
        <ArrowUpIcon className="size-4" />
        Curtir pergunta ({reactionCount})
      </button>
    </li>
  )
}
