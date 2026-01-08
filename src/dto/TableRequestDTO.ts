import z from "zod"
import { ObjectIdSchema } from "./CommonSchema"

//* CREATE
export const CreateTableRequest = z.object({
  tableNum: z.number().min(1, "Table number is required"),
  sectionNum: z.number().min(1, "Section number is required"),
})
export type CreateTableRequest = z.infer<typeof CreateTableRequest>

//* UPDATE
export const UpdateTableRequest = z.object({
  id: ObjectIdSchema,
  tableNum: z.number().min(1, "Table number is required"),
  sectionNum: z.number().min(1, "Section number is required"),
  tableStatus: z.string().optional(),
  isCompleted: z.boolean().optional(),
})
export type UpdateTableRequest = z.infer<typeof UpdateTableRequest>
