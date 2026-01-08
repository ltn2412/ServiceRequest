import Station from "@/model/Station"
import { Types } from "mongoose"

export const StationRepository = {
  existByStationNum: (stationNum: number) => Station.exists({ stationNum }).then(result => result as { _id: Types.ObjectId } | null),

  findByStationNum: (stationNum: number) => Station.findOne({ stationNum }),

  findAll: () => Station.find({ isActive: true }).lean(),
}

export default StationRepository
