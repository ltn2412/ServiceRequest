import { Response } from "express"
import z from "zod"
import { ErrorCode, ErrorCodeResponse } from "./ErrorCode"
import { appLoggerError } from "./Logger"

interface APIResponse<T> {
  Code: number
  Message?: string
  Data?: T
}

export function SuccessResponse<T>(res: Response, data: T, httpCode = 200) {
  const response: APIResponse<T> = {
    Code: 100,
    Message: "Success",
    Data: data,
  }
  return res.status(httpCode).json(response)
}

export function ErrorResponse(res: Response, errorCode: ErrorCode, message?: string) {
  const response: APIResponse<null> = {
    Code: ErrorCodeResponse[errorCode].Code,
    Message: message ? message : ErrorCodeResponse[errorCode].Message,
    Data: null,
  }
  return res.status(ErrorCodeResponse[errorCode].HttpCode).json(response)
}

export function ValidationErrorResponse(res: Response, error: z.ZodError) {
  const errorMessage = z.prettifyError(error)

  appLoggerError({ requestId: res.req.requestId! }, "Validation error:" + errorMessage)

  const response: APIResponse<null> = {
    Code: ErrorCodeResponse[ErrorCode.BAD_REQUEST].Code,
    Message: z.prettifyError(error).replace(/\n/g, " "),
    Data: null,
  }
  return res.status(400).json(response)
}
