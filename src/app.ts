import cors from "cors"
import express from "express"
import { StationController } from "./controller/StationController"
import { TableController } from "./controller/TableController"
import { TableRequestController } from "./controller/TableRequestController"
import { GlobalErrorMiddleware } from "./middleware/GlobalErrorMiddleware"
import { RequestLoggerMiddleware } from "./middleware/RequestLoggerMiddleware"

const app = express()

app.use(cors())
app.use(express.json())
app.use(RequestLoggerMiddleware)

app.use("/api/v1/station", StationController)
app.use("/api/v1/table-request", TableRequestController)
app.use("/api/v1/table", TableController)

app.use(GlobalErrorMiddleware)

export default app
