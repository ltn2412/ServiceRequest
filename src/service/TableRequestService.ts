import { AppError } from "@/common/AppError"
import { ErrorCode } from "@/common/ErrorCode"
import { CreateTableRequest, UpdateTableRequest } from "@/dto/TableRequestDTO"
import TableRequest from "@/model/TableRequest"
import TableRepository from "@/respository/TableRepository"
import TableRequestRepository from "@/respository/TableRequestRepository"

const TableRequestService = {
  getAllTableRequests: async () => await TableRequestRepository.findAll(),

  createTableRequest: async (request: CreateTableRequest) => {
    const { tableNum, stationNum } = request

    const tables = await TableRepository.findByTableNums([tableNum])

    if (tables.length === 0) throw new AppError(ErrorCode.NOT_FOUND, `Table ${tableNum} not found`)

    if (!tables[0].isActive) throw new AppError(ErrorCode.INACTIVE, `Table ${tableNum} inactive`)

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

    return { isCreated: true, data: await TableRequest.create({ tableNum, stationNum }) }
  },

  updateTableRequest: async (request: UpdateTableRequest) => {
    const { tableNum } = request

    const existed = await TableRequestRepository.findNotCompletedByTableNum(tableNum)

    if (existed.length === 0) throw new AppError(ErrorCode.NOT_FOUND, `Table request not found for table ${tableNum}`)

    return await TableRequest.updateOne(
      {
        tableNum,
        isCompleted: false,
      },
      {
        $set: {
          ...(request.stationNum !== undefined && { stationNum: request.stationNum }),
          ...(request.tableStatus !== undefined && { tableStatus: request.tableStatus }),
          ...(request.isCompleted !== undefined && { isCompleted: request.isCompleted }),
        },
      }
    )
  },
}

export default TableRequestService
