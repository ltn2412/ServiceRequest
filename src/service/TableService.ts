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

    const existedTables = await TableRepository.findByTableNums(tableNums)
    if (existedTables.length > 0) {
      const existedNums = existedTables.map(t => t.tableNum).join(", ")
      throw new AppError(ErrorCode.EXIST, `Table already exists for table number(s): ${existedNums}`)
    }

    const stations = await StationRepository.findByStationNums(stationNums)

    const stationNumSet = new Set(stationNums)
    const foundNumSet = new Set(stations.map(s => s.stationNum))

    const notFound = [...stationNumSet].filter(n => !foundNumSet.has(n))
    if (notFound.length > 0) throw new AppError(ErrorCode.NOT_FOUND, `Station not found: ${notFound.join(", ")}`)

    const inactive = stations.filter(s => !s.isActive).map(s => s.stationNum)

    if (inactive.length > 0) throw new AppError(ErrorCode.INACTIVE, `Station inactive: ${inactive.join(", ")}`)

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

    const existedTables = await TableRepository.findByTableNums(tableNums)

    const existedNumSet = new Set(existedTables.map(e => e.tableNum))
    const notFoundTables = tableNums.filter(n => !existedNumSet.has(n))

    if (notFoundTables.length > 0) throw new AppError(ErrorCode.NOT_FOUND, `Table not found: ${notFoundTables.join(", ")}`)

    const stationNums = request.map(r => r.stationNum).filter((n): n is number => n !== undefined)

    const stationMap = new Map<number, Types.ObjectId>()

    if (stationNums.length > 0) {
      const stations = await StationRepository.findByStationNums(stationNums)

      const reqSet = new Set(stationNums)
      const foundSet = new Set(stations.map(s => s.stationNum))

      const notFound = [...reqSet].filter(n => !foundSet.has(n))
      if (notFound.length > 0) throw new AppError(ErrorCode.NOT_FOUND, `Station not found: ${notFound.join(", ")}`)

      const inactive = stations.filter(s => !s.isActive).map(s => s.stationNum)

      if (inactive.length > 0) throw new AppError(ErrorCode.INACTIVE, `Station inactive: ${inactive.join(", ")}`)

      stations.forEach(s => stationMap.set(s.stationNum, s._id))
    }

    const bulkOps = request.map(item => ({
      updateOne: {
        filter: { tableNum: item.tableNum },
        update: {
          $set: {
            ...(item.stationNum !== undefined && {
              station: stationMap.get(item.stationNum),
            }),
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
