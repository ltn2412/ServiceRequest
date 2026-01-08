import { AppError } from "@/common/AppError"
import { ErrorCode } from "@/common/ErrorCode"
import { CreateListTable, UpdateListTable } from "@/dto/TableDTO"
import Table from "@/model/Table"
import TableRepository from "@/respository/TableRepository"

const TableService = {
  createTable: async (request: CreateListTable) => {
    const tableNums = request.map(r => r.tableNum)

    const existedTables = await TableRepository.findActiveByTableNums(tableNums)

    if (existedTables.length > 0) {
      const existedNums = existedTables.map(t => t.tableNum).join(", ")
      throw new AppError(ErrorCode.EXIST, `Table already exists (not completed) for table number(s): ${existedNums}`)
    }

    return await Table.insertMany(request)
  },

  updateTables: async (request: UpdateListTable) => {
    const tableNums = request.map(r => r.tableNum)

    const existedTables = await TableRepository.findActiveByTableNums(tableNums)

    if (existedTables.length !== tableNums.length) {
      const existedNums = new Set(existedTables.map(e => e.tableNum))
      const notFound = tableNums.filter(n => !existedNums.has(n))

      throw new AppError(ErrorCode.NOT_FOUND, `Table not found for table number(s): ${notFound.join(", ")}`)
    }

    const bulkOps = request.map(item => ({
      updateOne: {
        filter: { tableNum: item.tableNum },
        update: {
          $set: {
            ...(item.sectionNum !== undefined && { sectionNum: item.sectionNum }),
            ...(item.isActive !== undefined && { isActive: item.isActive }),
          },
        },
      },
    }))

    return await Table.bulkWrite(bulkOps)
  },

  getAllTables: async () => await TableRepository.findAll(),
}

export default TableService
