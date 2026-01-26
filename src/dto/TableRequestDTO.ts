import { TableStatus } from "@/model/TableRequest"
import z from "zod"

//* CREATE
export const CreateTableRequest = z.object({ tableNum: z.number().min(1, "Table number is required") })
export type CreateTableRequest = z.infer<typeof CreateTableRequest>

//* UPDATE
export const UpdateTableRequest = z.object({
  tableNum: z.number().min(1, "Table number is required"),
  tableStatus: z.enum(TableStatus).optional(),
})
export type UpdateTableRequest = z.infer<typeof UpdateTableRequest>

//* CHANGE STATION REQUEST
export const ChangeStationRequest = z.object({
  tableNum: z.number().min(1, "Table number is required"),
  stationNum: z.number().min(1, "Station number is required"),
})
export type ChangeStationRequest = z.infer<typeof ChangeStationRequest>

//* UPDATE COMPLETE REQUEST
export const UpdateCompleteRequest = z.object({
  tableNum: z.number().min(1, "Table number is required"),
})
export type UpdateCompleteRequest = z.infer<typeof UpdateCompleteRequest>
