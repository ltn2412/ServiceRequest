import z from "zod"

//* CREATE
export const CreateStation = z.object({
  stationNum: z.number().min(1, "Station number is required"),
  stationName: z.string().min(1, "Station name is required"),
})
export type CreateStation = z.infer<typeof CreateStation>

//* UPDATE
export const UpdateStation = z.object({
  stationNum: z.number().min(1, "Station number is required"),
  stationName: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type UpdateStation = z.infer<typeof UpdateStation>
