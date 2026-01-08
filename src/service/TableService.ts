import { AppError } from "@/common/AppError"
import { ErrorCode } from "@/common/ErrorCode"
import { CreateListTable, UpdateListTable } from "@/dto/TableDTO"
import Table from "@/model/Table"
import StationRepository from "@/respository/StationRepository"
import TableRepository from "@/respository/TableRepository"
import { Types } from "mongoose"

const TableService = {
  createTable: async (request: CreateListTable) => {
    const tableNums = request.map(r => r.tableNum)
    const stationNums = request.map(r => r.stationNum)

    const existedTables = await TableRepository.findActiveByTableNums(tableNums)
    if (existedTables.length > 0) {
      const existedNums = existedTables.map(t => t.tableNum).join(", ")
      throw new AppError(ErrorCode.EXIST, `Table already exists for table number(s): ${existedNums}`)
    }

    const stations = await StationRepository.findByStationNums(stationNums)

    if (stations.length !== new Set(stationNums).size) {
      const existedNums = new Set(stations.map(s => s.stationNum))
      const notFound = stationNums.filter(n => !existedNums.has(n))

      throw new AppError(ErrorCode.NOT_EXIST, `Station not found or inactive: ${notFound.join(", ")}`)
    }

    const stationMap = new Map<number, Types.ObjectId>()
    stations.forEach(s => stationMap.set(s.stationNum, s._id))

    const tablesToInsert = request.map(item => ({
      tableNum: item.tableNum,
      station: stationMap.get(item.stationNum),
      isActive: true,
    }))

    return await Table.insertMany(tablesToInsert)
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
            ...(item.stationNum !== undefined && { stationNum: item.stationNum }),
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
