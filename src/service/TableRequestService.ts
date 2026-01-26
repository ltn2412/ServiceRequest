import { AppError } from "@/common/AppError"
import { ErrorCode } from "@/common/ErrorCode"
import { CreateTableRequest, UpdateCompleteRequest, UpdateTableRequest } from "@/dto/TableRequestDTO"
import TableRequest, { TableStatus } from "@/model/TableRequest"
import StationRepository from "@/respository/StationRepository"
import TableRepository from "@/respository/TableRepository"
import TableRequestRepository from "@/respository/TableRequestRepository"
import { Types, UpdateQuery } from "mongoose"

const TableRequestService = {
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

  updateTableRequest: async (request: UpdateTableRequest) => {
    const { tableNum, tableStatus, isCompleted } = request

    const tables = await TableRepository.findByTableNums([tableNum])
    if (tables.length === 0) throw new AppError(ErrorCode.NOT_FOUND, `Table ${tableNum} not found`)
    if (!tables[0].isActive) throw new AppError(ErrorCode.INACTIVE, `Table ${tableNum} inactive`)

    const station = await StationRepository.findById(tables[0].station as Types.ObjectId)
    if (!station) throw new AppError(ErrorCode.NOT_FOUND, `Station for table ${tableNum} not found`)
    if (!station.isActive) throw new AppError(ErrorCode.INACTIVE, `Station for table ${tableNum} inactive`)

    const existed = await TableRequestRepository.findNotCompletedByTableNum(tableNum)
    if (existed.length === 0) throw new AppError(ErrorCode.NOT_FOUND, `Table request not found for table ${tableNum}`)

    type TableRequestUpdateQuery = UpdateQuery<{
      stationNum?: number
      tableStatus?: TableStatus[]
      isCompleted?: boolean
    }>

    const updateQuery: TableRequestUpdateQuery = {
      $set: {
        stationNum: station.stationNum,
        ...(isCompleted !== undefined && { isCompleted }),
      },
    }

    if (tableStatus) {
      updateQuery.$addToSet = {
        tableStatus: tableStatus,
      }
    }

    const updated = await TableRequest.findOneAndUpdate({ tableNum, isCompleted: false }, updateQuery, { new: true })

    return updated
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

  getAllTableRequests: async () => await TableRequestRepository.findAll(),

  getAllTableRequestsByStationNum: async (stationNum: number) => await TableRequestRepository.findByStationNum(stationNum),
}

export default TableRequestService
