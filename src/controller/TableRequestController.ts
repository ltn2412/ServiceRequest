import { SuccessResponse, ValidationErrorResponse } from "@/common/APIResponse"
import { CreateTableRequest, UpdateTableRequest } from "@/dto/TableRequestDTO"
import TableRequestService from "@/service/TableRequestService"
import { Request, Response, Router } from "express"

const Controller = {
  CreateTableRequest: async (req: Request, res: Response) => {
    const parsed = CreateTableRequest.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    SuccessResponse(res, await TableRequestService.createTableRequest(parsed.data))
  },

  updateTableRequest: async (req: Request, res: Response) => {
    const parsed = UpdateTableRequest.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    SuccessResponse(res, await TableRequestService.updateTableRequest(parsed.data))
  },

  getAllTableRequests: async (_: Request, res: Response) => SuccessResponse(res, await TableRequestService.getAllTableRequests()),
}

export const TableRequestController = Router()
TableRequestController.post("/", Controller.CreateTableRequest)
TableRequestController.put("/", Controller.updateTableRequest)
TableRequestController.get("/", Controller.getAllTableRequests)
