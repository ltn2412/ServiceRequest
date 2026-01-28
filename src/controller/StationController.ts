import { SuccessResponse, ValidationErrorResponse } from "@/common/APIResponse"
import { CreateStation, UpdateListStation } from "@/dto/StationDTO"
import StationService from "@/service/StationService"
import { Request, Response, Router } from "express"

const Controller = {
  createStation: async (req: Request, res: Response) => {
    const parsed = CreateStation.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    SuccessResponse(res, await StationService.createStation(parsed.data))
  },

  updateListStation: async (req: Request, res: Response) => {
    const parsed = UpdateListStation.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    SuccessResponse(res, await StationService.updateListStation(parsed.data))
  },

  getAllStations: async (_: Request, res: Response) => SuccessResponse(res, await StationService.getAllStations()),
}

export const StationController = Router()
StationController.post("/", Controller.createStation)
StationController.put("/", Controller.updateListStation)
StationController.get("/", Controller.getAllStations)
