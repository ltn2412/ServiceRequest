import Station from "@/model/Station"
import { Types } from "mongoose"

export const StationRepository = {
  existByStationNum: (stationNum: number) => Station.exists({ stationNum }).then(result => result as { _id: Types.ObjectId } | null),

  findByStationNum: (stationNum: number) => Station.findOne({ stationNum, isActive: true }),

  findByStationNums: (stationNums: number[]) => {
    return Station.find({
      stationNum: { $in: stationNums },
    })
  },

  findById: (id: Types.ObjectId) => Station.findOne({ _id: id }),

  findAll: () => Station.find({ isActive: true }).lean(),
}

export default StationRepository
