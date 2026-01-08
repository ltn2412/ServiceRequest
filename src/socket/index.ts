import { Server as HttpServer } from "http"
import { Server as SocketIOServer, Socket } from "socket.io"
import { registerTableSocket } from "./table.socket"

export function initSocket(server: HttpServer): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
  })

  io.on("connection", (socket: Socket) => {
    console.log("🔌 Socket connected:", socket.id)

    registerTableSocket(io, socket)

    socket.on("disconnect", () => console.log("❌ Socket disconnected:", socket.id))
  })

  return io
}
