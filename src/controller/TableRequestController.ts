import { SuccessResponse, ValidationErrorResponse } from "@/common/APIResponse"
import { ChangeStationRequest, CreateTableRequest, UpdateCompleteRequest, UpdateTableRequest } from "@/dto/TableRequestDTO"
import TableRequestService from "@/service/TableRequestService"
import { emitSocket, SocketEvent } from "@/socket/emitter"
import { Request, Response, Router } from "express"

const Controller = {
  createTableRequest: async (req: Request, res: Response) => {
    const parsed = CreateTableRequest.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    const { isCreated, data } = await TableRequestService.createTableRequest(parsed.data)
    emitSocket(isCreated ? SocketEvent.REQUEST_ADDED : SocketEvent.REQUEST_UPDATED, data)

    SuccessResponse(res, data)
  },

  updateTableRequest: async (req: Request, res: Response) => {
    const parsed = UpdateTableRequest.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    const updatedTableRequest = await TableRequestService.updateTableRequest(parsed.data)
    emitSocket(SocketEvent.REQUEST_UPDATED, updatedTableRequest)

    SuccessResponse(res, updatedTableRequest)
  },

  changeStationRequest: async (req: Request, res: Response) => {
    const parsed = ChangeStationRequest.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)
    const updatedTableRequest = await TableRequestService.changeStationRequest(parsed.data)
    emitSocket(SocketEvent.REQUEST_CHANGE_STATION, {
      ...updatedTableRequest,
      oldStationNum: parsed.data.stationNum,
    })
    SuccessResponse(res, updatedTableRequest)
  },

  updateCompleteRequest: async (req: Request, res: Response) => {
    const parsed = UpdateCompleteRequest.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    const updatedTableRequest = await TableRequestService.updateCompleteRequest(parsed.data)
    emitSocket(SocketEvent.REQUEST_UPDATED, updatedTableRequest)

    SuccessResponse(res, updatedTableRequest)
  },

  getTableRequests: async (req: Request, res: Response) => {
    const { stationNum } = req.query

    const data = stationNum ? await TableRequestService.getAllTableRequestsByStationNum(Number(stationNum)) : await TableRequestService.getAllTableRequests()

    return SuccessResponse(res, data)
  },
}

export const TableRequestController = Router()
TableRequestController.post("/", Controller.createTableRequest)
TableRequestController.put("/", Controller.updateTableRequest)
TableRequestController.post("/complete", Controller.updateCompleteRequest)
TableRequestController.get("/", Controller.getTableRequests)
