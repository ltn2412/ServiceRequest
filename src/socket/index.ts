import { Server as HttpServer } from "http"
import { Socket, Server as SocketIOServer } from "socket.io"
import { setSocketIO } from "./emitter"

export function initSocket(server: HttpServer): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
  })

  io.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id)

    setSocketIO(io)

    socket.on("disconnect", () => console.log("Socket disconnected:", socket.id))
  })

  return io
}
