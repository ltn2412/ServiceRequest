import multer, { FileFilterCallback, StorageEngine } from "multer"
import fs from "fs"
import path from "path"
import { Request } from "express"

export function createUploader(folder: string) {
  const uploadDir = path.join(__dirname, `../../images/${folder}`)
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const storage: StorageEngine = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir)
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      cb(null, uniqueSuffix + path.extname(file.originalname))
    },
  })

  const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const allowed = ["image/jpeg", "image/png", "image/webp"]
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error("Invalid file type. Only JPG, PNG, WEBP allowed"))
  }

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
  })
}
