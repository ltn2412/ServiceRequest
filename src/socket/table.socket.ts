import TableRequestService from "@/service/TableRequestService"
import { Server, Socket } from "socket.io"

export async function registerTableSocket(io: Server, socket: Socket) {
  socket.emit("table:init", await TableRequestService.getAllTableRequests())

  socket.on("table:add", async data => {
    const table = await TableRequestService.createTableRequest(data)
    io.emit("table:added", table)
  })

  socket.on("table:update", async data => {
    const table = await TableRequestService.updateTableRequest(data)
    io.emit("table:updated", table)
  })
}
