import { SuccessResponse, ValidationErrorResponse } from "@/common/APIResponse"
import { ChangeStationRequest, CreateServiceRequest, UpdateCompleteRequest, UpdateServiceRequest } from "@/dto/ServiceRequestDTO"
import TableRequestService from "@/service/ServiceRequestService"
import { emitSocket, SocketEvent } from "@/socket/emitter"
import { Request, Response, Router } from "express"

const Controller = {
  createServiceRequest: async (req: Request, res: Response) => {
    const parsed = CreateServiceRequest.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    const { isCreated, data } = await TableRequestService.createServiceRequest(parsed.data)
    emitSocket(isCreated ? SocketEvent.REQUEST_ADDED : SocketEvent.REQUEST_UPDATED, data)

    SuccessResponse(res, data)
  },

  updateServiceRequest: async (req: Request, res: Response) => {
    const parsed = UpdateServiceRequest.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    const updatedTableRequest = await TableRequestService.updateServiceRequest(parsed.data)
    emitSocket(SocketEvent.REQUEST_UPDATED, updatedTableRequest)

    SuccessResponse(res, updatedTableRequest)
  },

  changeStationRequest: async (req: Request, res: Response) => {
    const parsed = ChangeStationRequest.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    const updatedTableRequest = await TableRequestService.changeStationRequest(parsed.data)

    emitSocket(SocketEvent.REQUEST_CHANGE_STATION, updatedTableRequest)

    SuccessResponse(res, updatedTableRequest)
  },

  updateCompleteRequest: async (req: Request, res: Response) => {
    const parsed = UpdateCompleteRequest.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    const updatedTableRequest = await TableRequestService.updateCompleteRequest(parsed.data)
    emitSocket(SocketEvent.REQUEST_COMPLETED, updatedTableRequest)

    SuccessResponse(res, updatedTableRequest)
  },

  getServiceRequests: async (req: Request, res: Response) => {
    const { stationNum, isCompleted } = req.query

    const data = await TableRequestService.getAllServiceRequests({
      stationNum: stationNum ? Number(stationNum) : undefined,
      isCompleted: isCompleted !== undefined ? isCompleted === "true" : undefined,
    })

    return SuccessResponse(res, data)
  },
}

export const TableRequestController = Router()
TableRequestController.post("/", Controller.createServiceRequest)
TableRequestController.put("/", Controller.updateServiceRequest)
TableRequestController.post("/change", Controller.changeStationRequest)
TableRequestController.post("/complete", Controller.updateCompleteRequest)
TableRequestController.get("/", Controller.getServiceRequests)
