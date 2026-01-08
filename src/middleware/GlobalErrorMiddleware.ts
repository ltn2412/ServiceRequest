import { appLoggerError, appUnknownLoggerError } from "@/common/Logger"
import { NextFunction, Request, Response } from "express"
import { ErrorResponse } from "../common/APIResponse"
import { AppError } from "../common/AppError"
import { ErrorCode } from "../common/ErrorCode"

export const GlobalErrorMiddleware = (
  err: { message: string | undefined; stack: string | undefined; errorCode: ErrorCode; detail: string | undefined },
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    logError(req, err)
    return ErrorResponse(res, err.errorCode, err.detail)
  }

  if (err instanceof Error) {
    logError(req, err, true)
    return ErrorResponse(res, ErrorCode.UNKNOWN_ERROR, err.message)
  }

  logError(req, new Error(`Unknown error: ${JSON.stringify(err)}`), true)
  return ErrorResponse(res, ErrorCode.UNKNOWN_ERROR, "Unexpected error")
}

const logError = (req: Request, err: Error, unknownError: boolean = false) => {
  const errorLogger = unknownError ? appUnknownLoggerError : appLoggerError

  const stackOrMessage = unknownError ? err.stack : err.message

  const requestInfo = `Request: ${req.method} ${req.url}`

  const metaData = { requestId: req.requestId! }

  let uploadFile = ""
  if (req.file) uploadFile = ` Uploaded file: ${req.file.originalname}`

  if (req.method === "POST" || req.method === "PUT") {
    const contentType = req.headers["content-type"] || ""
    if (contentType.includes("application/json")) errorLogger(metaData, `${requestInfo} Body: ${JSON.stringify(req.body)} ${uploadFile}`, stackOrMessage)
    else if (contentType.includes("multipart/form-data")) {
      if (req.body && Object.keys(req.body).length > 0)
        errorLogger(metaData, `${requestInfo} FormData Fields: ${JSON.stringify(req.body)} ${uploadFile}`, stackOrMessage)
      else errorLogger(metaData, `${requestInfo} FormData Fields: [Empty] ${uploadFile}`, stackOrMessage)
    } else if (contentType === "") errorLogger(metaData, `${requestInfo} Body: [Empty Content-Type] ${uploadFile}`, stackOrMessage)
    else errorLogger(metaData, `${requestInfo} Body: [Unknown Content-Type: ${contentType}] ${uploadFile}`, stackOrMessage)
  } else errorLogger(metaData, `${requestInfo} ${uploadFile}`, stackOrMessage)
}
