import { TableStatus } from "@/model/TableRequest"
import z from "zod"

//* CREATE
export const CreateTableRequest = z.object({ tableNum: z.number().min(1, "Table number is required") })
export type CreateTableRequest = z.infer<typeof CreateTableRequest>

//* UPDATE
export const UpdateTableRequest = z.object({
  tableNum: z.number().min(1, "Table number is required"),
  tableStatus: z.enum(TableStatus).optional(),
  isCompleted: z.boolean().optional(),
})
export type UpdateTableRequest = z.infer<typeof UpdateTableRequest>
