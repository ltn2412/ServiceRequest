import { AppError } from "@/common/AppError"
import { ErrorCode } from "@/common/ErrorCode"
import { ChangeStationRequest, CreateServiceRequest, UpdateCompleteRequest, UpdateServiceRequest } from "@/dto/ServiceRequestDTO"
import TableRequest, { ServiceStatus } from "@/model/ServiceRequest"
import StationRepository from "@/respository/StationRepository"
import TableRepository from "@/respository/TableRepository"
import TableRequestRepository from "@/respository/ServiceRequestRepository"
import { Types, UpdateQuery } from "mongoose"

const ServiceRequestService = {
  createServiceRequest: async (request: CreateServiceRequest) => {
    const { tableNum } = request

    const tables = await TableRepository.findByTableNums([tableNum])
    if (tables.length === 0) throw new AppError(ErrorCode.NOT_FOUND, `Table ${tableNum} not found`)
    if (!tables[0].isActive) throw new AppError(ErrorCode.INACTIVE, `Table ${tableNum} inactive`)

    const station = await StationRepository.findById(tables[0].station as Types.ObjectId)
    if (!station) throw new AppError(ErrorCode.NOT_FOUND, `Station for table ${tableNum} not found`)
    if (!station.isActive) throw new AppError(ErrorCode.INACTIVE, `Station for table ${tableNum} inactive`)

    const existed = await TableRequestRepository.findNotCompletedByTableNum(tableNum)

    if (existed.length > 0) {
      const updated = await TableRequest.findOneAndUpdate({ tableNum, isCompleted: false }, { $inc: { requestCount: 1 } }, { new: true })

      return { isCreated: false, data: updated }
    }

    return {
      isCreated: true,
      data: await TableRequest.create({
        tableNum,
        stationNum: station.stationNum,
        tableStatus: [],
      }),
    }
  },

  updateServiceRequest: async (request: UpdateServiceRequest) => {
    const { tableNum, serviceStatus } = request

    const tables = await TableRepository.findByTableNums([tableNum])
    if (tables.length === 0) throw new AppError(ErrorCode.NOT_FOUND, `Table ${tableNum} not found`)
    if (!tables[0].isActive) throw new AppError(ErrorCode.INACTIVE, `Table ${tableNum} inactive`)

    const existed = await TableRequestRepository.findNotCompletedByTableNum(tableNum)
    if (existed.length === 0) throw new AppError(ErrorCode.NOT_FOUND, `Table request not found for table ${tableNum}`)

    const updateQuery: UpdateQuery<{
      serviceStatus?: ServiceStatus[]
    }> = {}

    if (serviceStatus) {
      updateQuery.$addToSet = {
        serviceStatus,
      }
    }

    const updated = await TableRequest.findOneAndUpdate({ tableNum, isCompleted: false }, updateQuery, { new: true })

    return updated
  },

  changeStationRequest: async (request: ChangeStationRequest) => {
    const { tableNum, stationNum } = request

    const tables = await TableRepository.findByTableNums([tableNum])
    if (tables.length === 0) throw new AppError(ErrorCode.NOT_FOUND, `Table ${tableNum} not found`)
    if (!tables[0].isActive) throw new AppError(ErrorCode.INACTIVE, `Table ${tableNum} inactive`)

    const station = await StationRepository.findByStationNum(stationNum)
    if (!station) throw new AppError(ErrorCode.NOT_FOUND, `Station ${stationNum} not found`)
    if (!station.isActive) throw new AppError(ErrorCode.INACTIVE, `Station ${stationNum} inactive`)

    const existed = await TableRequest.findOne({
      tableNum,
      isCompleted: false,
    })
    if (!existed) throw new AppError(ErrorCode.NOT_FOUND, `Table request not found for table ${tableNum}`)

    if (existed.stationNum === station.stationNum) throw new AppError(ErrorCode.BAD_REQUEST, `Table ${tableNum} is already assigned to station ${stationNum}`)

    const oldStationNum = existed.stationNum

    existed.stationNum = station.stationNum
    await existed.save()

    return {
      ...existed.toObject(),
      oldStationNum,
    }
  },

  updateCompleteRequest: async (request: UpdateCompleteRequest) => {
    const { tableNum } = request

    const updated = await TableRequest.findOneAndUpdate(
      { tableNum, isCompleted: false },
      {
        $set: { isCompleted: true },
      },
      { new: true }
    )

    if (!updated) throw new AppError(ErrorCode.NOT_FOUND, `Active table request not found for table ${tableNum}`)

    return updated
  },

  getAllServiceRequests: async (filter: { stationNum?: number; isCompleted?: boolean }) => TableRequestRepository.find(filter),
}

export default ServiceRequestService
