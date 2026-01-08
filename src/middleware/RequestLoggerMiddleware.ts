import { appLoggerInfo } from "@/common/Logger"
import { NextFunction, Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"

export const RequestLoggerMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const requestId = uuidv4().split("-")[0]
  req.requestId = requestId
  const requestInfo = `Request: ${req.method} ${req.originalUrl}`
  let logMessage = requestInfo

  if (req.method === "POST" || req.method === "PUT") {
    const contentType = req.headers["content-type"] || ""
    if (contentType.includes("application/json")) logMessage += ` Body: ${JSON.stringify(req.body)}`
    else if (contentType.includes("multipart/form-data")) logMessage += ` Body: [multipart/form-data]`
    else logMessage += ` Body: [Unknown Content-Type: ${contentType}]`
  }

  appLoggerInfo({ requestId }, logMessage)
  next()
}
