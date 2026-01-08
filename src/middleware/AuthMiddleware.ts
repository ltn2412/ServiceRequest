import { ErrorResponse } from "@/common/APIResponse"
import { ErrorCode } from "@/common/ErrorCode"
import { appLoggerError } from "@/common/Logger"
import { IPermission } from "@/model/Permission"
import { IRole } from "@/model/Role"
import AccountRepository from "@/respository/AccountRepository"
import { NextFunction, Request, Response } from "express"
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"

export interface JwtPayload {
  accountId: string
  username: string
  accessToken: boolean
}

export enum PERMISSION {
  //* EDIT
  EDIT_ACCOUNT = "EDIT_ACCOUNT",
  EDIT_MENU = "EDIT_MENU",
  EDIT_TABLE = "EDIT_TABLE",
  EDIT_PAYMENT_METHOD = "EDIT_PAYMENT_METHOD",
  EDIT_PRINTER = "EDIT_PRINTER",
  EDIT_KDS = "EDIT_KDS",
  EDIT_SHIFT = "EDIT_SHIFT",

  //* VIEW
  VIEW_ACCOUNT = "VIEW_ACCOUNT",
  VIEW_MENU = "VIEW_MENU",
  VIEW_TABLE = "VIEW_TABLE",
  VIEW_ORDER = "VIEW_ORDER",

  ACCESS_TABLE = "ACCESS_TABLE",
  CREATE_ORDER = "CREATE_ORDER",
  CREATE_HOW_PAID = "CREATE_HOW_PAID",
  VOID_ITEM = "VOID_ITEM",
  SPLIT_ORDER = "SPLIT_ORDER",
}

export const authorize = (permissions: PERMISSION[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //* --- Verify token ---
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      appLoggerError({ requestId: req.requestId! }, "Token not found")
      return ErrorResponse(res, ErrorCode.UNAUTHENTICATED, "Token not found")
    }

    const token = authHeader.split(" ")[1]

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

      if (!decoded.accessToken) {
        appLoggerError({ requestId: req.requestId! }, "Invalid access token")
        return ErrorResponse(res, ErrorCode.UNAUTHORIZED, "Invalid access token")
      }

      const accountWithPermissions = await AccountRepository.findByIdWithPermissions(decoded.accountId)
      if (!accountWithPermissions) {
        appLoggerError({ requestId: req.requestId! }, "Account not found")
        return ErrorResponse(res, ErrorCode.UNAUTHORIZED, "Account not found")
      }

      const rolePerms = (accountWithPermissions.role as IRole & { permissions: IPermission[] })?.permissions.map((p: IPermission) => p.permissionName) ?? []

      const customPerms = (accountWithPermissions.customPermissions as IPermission[])?.map(p => p.permissionName) ?? []

      const allPerms = new Set([...rolePerms, ...customPerms])

      const hasAll = permissions.every(p => allPerms.has(p))
      if (!hasAll) return ErrorResponse(res, ErrorCode.UNAUTHORIZED, "Not enough permission")

      req.accountId = decoded.accountId

      next()
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        appLoggerError({ requestId: req.requestId! }, "Token has expired")
        return ErrorResponse(res, ErrorCode.UNAUTHORIZED, "Token has expired")
      }
      if (err instanceof JsonWebTokenError) {
        appLoggerError({ requestId: req.requestId! }, "Invalid token")
        return ErrorResponse(res, ErrorCode.UNAUTHORIZED, "Invalid token")
      }
      appLoggerError({ requestId: req.requestId! }, "Token verification failed")
      return ErrorResponse(res, ErrorCode.UNAUTHORIZED, "Token verification failed")
    }
  }
}
