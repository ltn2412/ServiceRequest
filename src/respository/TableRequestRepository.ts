import TableRequest from "@/model/TableRequest"

export const TableRequestRepository = {
  findNotCompletedByTableNum: async (tableNum: number) => {
    return TableRequest.find({
      tableNum: tableNum,
      isCompleted: false,
    })
  },

  findAll: () => TableRequest.find().lean(),

  findByStationNum: (stationNum: number) => TableRequest.find({ stationNum: stationNum, isCompleted: false }).lean(),
}

export default TableRequestRepository
