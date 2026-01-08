import { Server as HttpServer } from "http"
import { Socket, Server as SocketIOServer } from "socket.io"

export function initSocket(server: HttpServer): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
  })

  io.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id)

    socket.on("disconnect", () => console.log("Socket disconnected:", socket.id))
  })

  return io
}
