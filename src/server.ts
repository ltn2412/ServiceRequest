import http from "http"
import app from "./app"
import connectDB from "./respository/AppDB"
import { initSocket } from "./socket"

async function bootstrap() {
  await connectDB()

  const server = http.createServer(app)
  initSocket(server)

  server.listen(process.env.PORT, () => console.log(`Server running at ${process.env.BASE_URL}:${process.env.PORT}`))
}

bootstrap()
