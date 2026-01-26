import { TableStatus } from "@/model/TableRequest"
import z from "zod"

//* CREATE
export const CreateTableRequest = z.object({ tableNum: z.number().min(1, "Table number is required") })
export type CreateTableRequest = z.infer<typeof CreateTableRequest>

//* UPDATE
export const UpdateTableRequest = z.object({
  tableNum: z.number().min(1, "Table number is required"),
  stationNum: z.number().optional(),
  tableStatus: z.enum(TableStatus).optional(),
})
export type UpdateTableRequest = z.infer<typeof UpdateTableRequest>

//* UPDATE COMPLETE REQUEST
export const UpdateCompleteRequest = z.object({
  tableNum: z.number().min(1, "Table number is required"),
})
export type UpdateCompleteRequest = z.infer<typeof UpdateCompleteRequest>
