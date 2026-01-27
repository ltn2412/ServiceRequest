import TableRequest from "@/model/TableRequest"

type TableRequestQuery = Partial<{
  stationNum: number
  isCompleted: boolean
}>

export const TableRequestRepository = {
  findNotCompletedByTableNum: async (tableNum: number) => {
    return TableRequest.find({
      tableNum: tableNum,
      isCompleted: false,
    })
  },

  find: (filter: TableRequestQuery) => {
    const query: TableRequestQuery = {}

    if (filter.stationNum !== undefined) query.stationNum = filter.stationNum

    if (filter.isCompleted !== undefined) query.isCompleted = filter.isCompleted

    return TableRequest.find(query).lean()
  },
}

export default TableRequestRepository
