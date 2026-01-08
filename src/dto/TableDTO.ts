import z from "zod"

//* CREATE
export const CreateTable = z.object({
  tableNum: z.number().min(1, "Table number is required"),
  stationNum: z.number().min(1, "Station number is required"),
})
export type CreateTable = z.infer<typeof CreateTable>

export const CreateListTable = z.array(CreateTable).min(1, "At least one table is required")
export type CreateListTable = z.infer<typeof CreateListTable>

//* UPDATE
export const UpdateTable = z.object({
  tableNum: z.number().min(1, "Table number is required"),
  stationNum: z.number().optional(),
  isActive: z.boolean().optional(),
})

export type UpdateTable = z.infer<typeof UpdateTable>
export const UpdateListTable = z.array(UpdateTable).min(1, "At least one table is required")
export type UpdateListTable = z.infer<typeof UpdateListTable>
