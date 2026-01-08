import { SuccessResponse, ValidationErrorResponse } from "@/common/APIResponse"
import { CreateStation, UpdateStation } from "@/dto/StationDTO"
import StationService from "@/service/StationService"
import { Request, Response, Router } from "express"

const Controller = {
  createStation: async (req: Request, res: Response) => {
    const parsed = CreateStation.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    SuccessResponse(res, await StationService.createStation(parsed.data))
  },

  updateStation: async (req: Request, res: Response) => {
    const parsed = UpdateStation.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    SuccessResponse(res, await StationService.updateStation(parsed.data))
  },

  getAllStations: async (_: Request, res: Response) => SuccessResponse(res, await StationService.getAllStations()),
}

export const StationController = Router()
StationController.post("/", Controller.createStation)
StationController.put("/", Controller.updateStation)
StationController.get("/", Controller.getAllStations)
