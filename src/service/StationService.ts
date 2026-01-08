import { AppError } from "@/common/AppError"
import { ErrorCode } from "@/common/ErrorCode"
import { CreateStation, UpdateStation } from "@/dto/StationDTO"
import Station from "@/model/Station"
import StationRepository from "@/respository/StationRepository"

const StationService = {
  createStation: async (request: CreateStation) => {
    if (await StationRepository.existByStationNum(request.stationNum))
      throw new AppError(ErrorCode.EXIST, `Station already exists for station number: ${request.stationNum}`)

    return await Station.create(request)
  },

  updateStation: async (request: UpdateStation) => {
    const existingStation = await StationRepository.findByStationNum(request.stationNum)
    if (!existingStation) throw new AppError(ErrorCode.NOT_EXIST, `Station ${request.stationNum} does not exist`)

    Object.assign(existingStation, request)

    return await existingStation.save()
  },

  getAllStations: async () => await StationRepository.findAll(),
}

export default StationService
