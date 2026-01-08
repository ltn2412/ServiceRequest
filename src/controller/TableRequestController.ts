import { SuccessResponse, ValidationErrorResponse } from "@/common/APIResponse"
import { CreateTableRequest, UpdateTableRequest } from "@/dto/TableRequestDTO"
import TableRequestService from "@/service/TableRequestService"
import { emitSocket, SocketEvent } from "@/socket/emitter"
import { Request, Response, Router } from "express"

const Controller = {
  createTableRequest: async (req: Request, res: Response) => {
    const parsed = CreateTableRequest.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    const newTableRequest = await TableRequestService.createTableRequest(parsed.data)
    emitSocket(SocketEvent.TABLE_ADDED, newTableRequest)

    SuccessResponse(res, newTableRequest)
  },

  updateTableRequest: async (req: Request, res: Response) => {
    const parsed = UpdateTableRequest.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    const updatedTableRequest = await TableRequestService.updateTableRequest(parsed.data)
    emitSocket(SocketEvent.TABLE_UPDATED, updatedTableRequest)

    SuccessResponse(res, updatedTableRequest)
  },

  getAllTableRequests: async (_: Request, res: Response) => SuccessResponse(res, await TableRequestService.getAllTableRequests()),
}

export const TableRequestController = Router()
TableRequestController.post("/", Controller.createTableRequest)
TableRequestController.put("/", Controller.updateTableRequest)
TableRequestController.get("/", Controller.getAllTableRequests)
