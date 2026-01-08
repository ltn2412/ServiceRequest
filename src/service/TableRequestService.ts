import { AppError } from "@/common/AppError"
import { ErrorCode } from "@/common/ErrorCode"
import { CreateTableRequest, UpdateTableRequest } from "@/dto/TableRequestDTO"
import TableRequest from "@/model/TableRequest"
import TableRepository from "@/respository/TableRepository"
import TableRequestRepository from "@/respository/TableRequestRepository"

const TableRequestService = {
  getAllTableRequests: async () => await TableRequestRepository.findAll(),

  createTableRequest: async (request: CreateTableRequest) => {
    const { tableNum } = request

    const table = await TableRepository.findByTableNums([tableNum])
    if (table.length === 0) throw new AppError(ErrorCode.NOT_EXIST, `Table ${tableNum} not found`)
    if (table[0].isActive === false) throw new AppError(ErrorCode.NOT_EXIST, `Table ${tableNum} not active or not found`)

    const existedRequest = await TableRequestRepository.findNotCompletedByTableNum(tableNum)

    if (existedRequest.length > 0) throw new AppError(ErrorCode.EXIST, `Table request already exists for table ${tableNum}`)

    return await TableRequest.create({
      tableNum: request.tableNum,
      stationNum: request.stationNum,
      isCompleted: false,
    })
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
