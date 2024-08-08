interface GetRoomMessagesRequest {
  roomId: string
}

interface GetRoomMessagesResponse {
  ID: string
  RoomID: string
  Message: string
  ReactionCount: number
  Answered: boolean
}

export async function getRoomMessages({ roomId }: GetRoomMessagesRequest) {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/rooms/${roomId}/messages`,
  )

  const data: GetRoomMessagesResponse[] = await response.json()

  return {
    messages: data
      .sort((a, b) => (a.ReactionCount < b.ReactionCount ? 1 : -1))
      .map(item => ({
        id: item.ID,
        message: item.Message,
        reactionCount: item.ReactionCount,
        answered: item.Answered,
      })),
  }
}
