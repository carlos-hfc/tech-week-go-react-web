interface CreateMessageRequest {
  roomId: string
  message: string
}

interface CreateMessageResponse {
  id: string
}

export async function createMessage({ message, roomId }: CreateMessageRequest) {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/rooms/${roomId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ message, roomId }),
    },
  )

  const data: CreateMessageResponse = await response.json()

  return {
    messageId: data.id,
  }
}
