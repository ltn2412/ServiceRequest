import TableRequest from "@/model/TableRequest"

export const TableRequestRepository = {
  findNotCompletedByTableNum: async (tableNum: number) => {
    return TableRequest.find({
      tableNum: tableNum,
      isCompleted: false,
    })
  },

  findAll: () => TableRequest.find().lean(),
}

export default TableRequestRepository
