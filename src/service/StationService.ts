import { AppError } from "@/common/AppError"
import { ErrorCode } from "@/common/ErrorCode"
import { CreateStation, UpdateListStation } from "@/dto/StationDTO"
import Station from "@/model/Station"
import StationRepository from "@/respository/StationRepository"

const StationService = {
  createStation: async (request: CreateStation) => {
    if (await StationRepository.existByStationNum(request.stationNum))
      throw new AppError(ErrorCode.EXIST, `Station already exists for station number: ${request.stationNum}`)

    return await Station.create(request)
  },

  updateListStation: async (requests: UpdateListStation) => {
    if (!requests.length) return []

    const operations = requests.map(item => {
      const { stationNum, stationName, isActive } = item

      return {
        updateOne: {
          filter: { stationNum },
          update: {
            $set: {
              ...(stationName !== undefined && { stationName }),
              ...(isActive !== undefined && { isActive }),
            },
          },
        },
      }
    })

    const result = await Station.bulkWrite(operations)

    if (result.matchedCount === 0) throw new AppError(ErrorCode.NOT_FOUND, "No stations were updated")

    const stationNums = requests.map(i => i.stationNum)
    return Station.find({ stationNum: { $in: stationNums } }).sort({ stationNum: 1 })
  },

  getAllStations: async () => await StationRepository.findAll(),
}

export default StationService
