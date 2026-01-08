import cors from "cors"
import express from "express"
import http from "http"
import { Server } from "socket.io"
import { StationController } from "./controller/StationController"
import { TableController } from "./controller/TableController"
import { TableRequestController } from "./controller/TableRequestController"
import { GlobalErrorMiddleware } from "./middleware/GlobalErrorMiddleware"
import { RequestLoggerMiddleware } from "./middleware/RequestLoggerMiddleware"
import connectDB from "./respository/AppDB"
import TableRequestService from "./service/TableRequestService"

const app = express()

app.use(cors())
app.use(express.json())
app.use(RequestLoggerMiddleware)

//* Socket IO
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "*" },
})

io.on("connection", async socket => {
  socket.emit("table:init", await TableRequestService.getAllTableRequests())

  socket.on("table:add", async data => {
    const table = await TableRequestService.createTableRequest(data)
    io.emit("table:added", table)
  })

  socket.on("table:update", async data => {
    const table = await TableRequestService.updateTableRequest(data)
    io.emit("table:updated", table)
  })
})

app.use("/api/v1/station", StationController)
app.use("/api/v1/table-request", TableRequestController)
app.use("/api/v1/table", TableController)

app.use(GlobalErrorMiddleware)

connectDB()

server.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.BASE_URL}:${process.env.PORT}`))
