import { ServiceStatus } from "@/model/TableRequest"
import z from "zod"

//* CREATE
export const CreateServiceRequest = z.object({ tableNum: z.number().min(1, "Table number is required") })
export type CreateServiceRequest = z.infer<typeof CreateServiceRequest>

//* UPDATE
export const UpdateServiceRequest = z.object({
  tableNum: z.number().min(1, "Table number is required"),
  serviceStatus: z.enum(ServiceStatus).optional(),
})
export type UpdateServiceRequest = z.infer<typeof UpdateServiceRequest>

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
