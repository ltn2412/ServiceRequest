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
    const { stationNum, stationName, isActive } = request

    const updated = await Station.findOneAndUpdate(
      { stationNum: stationNum },
      {
        $set: {
          ...(stationName !== undefined && { stationName }),
          ...(isActive !== undefined && { isActive }),
        },
      },
      { new: true }
    )

    if (!updated) throw new AppError(ErrorCode.NOT_FOUND, `Station ${request.stationNum} does not exist`)

    return updated
  },
  getAllStations: async () => await StationRepository.findAll(),
}

export default StationService
