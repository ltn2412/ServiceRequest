import { AppError } from "@/common/AppError"
import { ErrorCode } from "@/common/ErrorCode"
import { CreateTableRequest, UpdateTableRequest } from "@/dto/TableRequestDTO"
import TableRequest from "@/model/TableRequest"
import StationRepository from "@/respository/StationRepository"
import TableRepository from "@/respository/TableRepository"
import TableRequestRepository from "@/respository/TableRequestRepository"
import { Types } from "mongoose"

const TableRequestService = {
  getAllTableRequests: async () => await TableRequestRepository.findAll(),

  createTableRequest: async (request: CreateTableRequest) => {
    const { tableNum } = request

    const tables = await TableRepository.findByTableNums([tableNum])

    if (tables.length === 0) throw new AppError(ErrorCode.NOT_FOUND, `Table ${tableNum} not found`)

    if (!tables[0].isActive) throw new AppError(ErrorCode.INACTIVE, `Table ${tableNum} inactive`)

    const station = await StationRepository.findById(tables[0].station as Types.ObjectId)

    if (!station) throw new AppError(ErrorCode.NOT_FOUND, `Station for table ${tableNum} not found`)

    if (!station.isActive) throw new AppError(ErrorCode.INACTIVE, `Station for table ${tableNum} inactive`)

    const existed = await TableRequestRepository.findNotCompletedByTableNum(tableNum)

    if (existed.length > 0) {
      const updated = await TableRequest.findOneAndUpdate(
        {
          tableNum,
          isCompleted: false,
        },
        { $inc: { requestCount: 1 } },
        { new: true }
      )

      return { isCreated: false, data: updated }
    }

    return { isCreated: true, data: await TableRequest.create({ tableNum, stationNum: station.stationNum }) }
  },

  updateTableRequest: async (request: UpdateTableRequest) => {
    const { tableNum } = request

    const tables = await TableRepository.findByTableNums([tableNum])

    if (tables.length === 0) throw new AppError(ErrorCode.NOT_FOUND, `Table ${tableNum} not found`)

    if (!tables[0].isActive) throw new AppError(ErrorCode.INACTIVE, `Table ${tableNum} inactive`)

    const station = await StationRepository.findById(tables[0].station as Types.ObjectId)

    if (!station) throw new AppError(ErrorCode.NOT_FOUND, `Station for table ${tableNum} not found`)

    if (!station.isActive) throw new AppError(ErrorCode.INACTIVE, `Station for table ${tableNum} inactive`)

    const existed = await TableRequestRepository.findNotCompletedByTableNum(tableNum)

    if (existed.length === 0) throw new AppError(ErrorCode.NOT_FOUND, `Table request not found for table ${tableNum}`)

    const updated = await TableRequest.findOneAndUpdate(
      {
        tableNum,
        isCompleted: false,
      },
      {
        $set: {
          stationNum: station.stationNum,
          ...(request.tableStatus !== undefined && {
            tableStatus: request.tableStatus,
          }),
          ...(request.isCompleted !== undefined && {
            isCompleted: request.isCompleted,
          }),
        },
      },
      { new: true }
    )

    return updated
  },
}

export default TableRequestService
