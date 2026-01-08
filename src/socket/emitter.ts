import { appLoggerSocket } from "@/common/Logger"
import { Server } from "socket.io"

let io: Server | null = null

export function setSocketIO(server: Server) {
  io = server
}

export function emitSocket<T>(event: SocketEvent, payload: T): void {
  if (!io) {
    console.warn(`[SocketEmitter] IO not initialized, skip emit ${event}`)
    return
  }

  appLoggerSocket(`Emitting socket event: ${event}: ${JSON.stringify(payload)}`)

  io.emit(event, payload)
}

export enum SocketEvent {
  REQUEST_ADDED = "request:added",
  REQUEST_UPDATED = "request:updated",
  REQUEST_ERROR = "request:error",
}
