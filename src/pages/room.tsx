import { useParams } from "react-router-dom"

export function Room() {
  const params = useParams()

  return <h1>Room: {JSON.stringify(params)}</h1>
}
