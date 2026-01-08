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

  io.emit(event, payload)
}

export enum SocketEvent {
  TABLE_ADDED = "table:added",
  TABLE_UPDATED = "table:updated",
  TABLE_ERROR = "table:error",
}
