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

    const activeTable = await TableRepository.findActiveByTableNums([tableNum])
    if (activeTable.length === 0) throw new AppError(ErrorCode.NOT_EXIST, `Table ${tableNum} not active or not found`)

    const existedRequest = await TableRequestRepository.findNotCompletedByTableNum(tableNum)

    if (existedRequest.length > 0) throw new AppError(ErrorCode.EXIST, `Table request already exists (not completed) for table ${tableNum}`)

    await TableRequest.create({
      tableNum: request.tableNum,
      sectionNum: request.sectionNum,
      isCompleted: false,
    })
  },

  updateTableRequest: async (request: UpdateTableRequest) => {
    const { tableNum } = request

    const existed = await TableRequestRepository.findNotCompletedByTableNum(tableNum)

    if (existed.length === 0) throw new AppError(ErrorCode.NOT_FOUND, `Active table request not found for table ${tableNum}`)

    await TableRequest.updateOne(
      {
        tableNum,
        isCompleted: false,
      },
      {
        $set: {
          ...(request.sectionNum !== undefined && { sectionNum: request.sectionNum }),
          ...(request.tableStatus !== undefined && { tableStatus: request.tableStatus }),
          ...(request.isCompleted !== undefined && { isCompleted: request.isCompleted }),
        },
      }
    )
  },
}

export default TableRequestService
