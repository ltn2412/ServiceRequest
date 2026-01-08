import type { JwtPayload } from "@/middleware/AuthMiddleware"

declare global {
  namespace Express {
    interface Request {
      requestId?: string
      token?: JwtPayload
      accountId?: string
    }
  }
}
