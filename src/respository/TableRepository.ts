import Table from "@/model/Table"

export const TableRepository = {
  findByTableNums: async (tableNums: number[]) => {
    return Table.find({
      tableNum: { $in: tableNums },
    })
  },

  findAll: () => Table.find({ isActive: true }).populate("station", "stationNum stationName isActive").lean(),
}

export default TableRepository
