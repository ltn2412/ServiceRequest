import Table from "@/model/Table"

export const TableRepository = {
  findActiveByTableNums: async (tableNums: number[]) => {
    return Table.find({
      tableNum: { $in: tableNums },
    })
  },

  findAll: () => Table.find({ isActive: true }).populate("section", "sectionName isActive").lean(),
}

export default TableRepository
