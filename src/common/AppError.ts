import { ErrorCode, ErrorCodeResponse } from "./ErrorCode"

export class AppError extends Error {
  constructor(public errorCode: ErrorCode, public detail?: string) {
    super(detail ? detail : ErrorCodeResponse[errorCode].Message)
  }
}
