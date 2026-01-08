import { SuccessResponse, ValidationErrorResponse } from "@/common/APIResponse"
import { CreateListTable, UpdateListTable } from "@/dto/TableDTO"
import TableService from "@/service/TableService"
import { Request, Response, Router } from "express"

const Controller = {
  CreateTable: async (req: Request, res: Response) => {
    const parsed = CreateListTable.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    SuccessResponse(res, await TableService.createTable(parsed.data))
  },

  updateTable: async (req: Request, res: Response) => {
    const parsed = UpdateListTable.safeParse(req.body)
    if (!parsed.success) return ValidationErrorResponse(res, parsed.error)

    SuccessResponse(res, await TableService.updateTables(parsed.data))
  },

  getAllTables: async (_: Request, res: Response) => SuccessResponse(res, await TableService.getAllTables()),
}

export const TableController = Router()
TableController.post("/", Controller.CreateTable)
TableController.put("/", Controller.updateTable)
TableController.get("/", Controller.getAllTables)
