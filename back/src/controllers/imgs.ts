import { Request, Response } from "express"
import path from "path"

export const getImg = (req: Request, res: Response) => {
  const { imgName } = req.params
  const img = path.join(__dirname, `../../uploads/${imgName}`)
  res.sendFile(img);
}

export const saveImg = (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[]
  const fileNames = files.map(file => file.filename)
  res.json(fileNames)
}