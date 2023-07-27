import multer, { FileFilterCallback } from "multer"
import { Request } from "express"
import mimeTypes from "mime-types"
import { BadRequestError } from "../errors/bad-request"
import fs from "fs"

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, "./uploads")
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const fileExt = mimeTypes.extension(file.mimetype)
    let uniqueSuffix: string
    //@ts-ignore
    uniqueSuffix = req.user.userId + "_" + Date.now()

    const fileName = uniqueSuffix + "." + fileExt
    cb(null, fileName)
  },
})

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new BadRequestError("Only image files are allowed"))
  }
  if (file.size > 2048) {
    cb(new BadRequestError("File size is too large (max 2048 KB)"))
  }
  if (
    file.fieldname === "gallery" && (
    !req.body.fileIndexes ||
    req.body.fileIndexes.length === 0)
  ) {
    cb(new BadRequestError("Missing file indexes"))
  }

  if (req.body.fileIndexes && req.body.fileIndexes.length > 0) {
    const indexes = req.body.fileIndexes as number[]
    const duplicates = indexes.filter(
      (item: number, index: number) => indexes.indexOf(item) !== index
    )
    if (duplicates.length > 0) {
      cb(new BadRequestError("Duplicate file indexes"))
    }
  }
  //TODO
  // const route = req.baseUrl.substring(req.baseUrl.length + 1)
  // if (req.baseUrl === Routes.SECTIONS) {
  //   req.body.fileIndexes.array.forEach((value: number) => {
  //     if (value >= 5) {
  //       throw new BadRequestError("File index is out of range (0-4)")
  //     }
  //   })
  // } else if (req.baseUrl === Routes.ITEMS) {
  //   req.body.fileIndexes.array.forEach((value: number) => {
  //     if (value >= 8) {
  //       throw new BadRequestError("File index is out of range (0-7)")
  //     }
  //   })
  // }

  cb(null, true)
}

const fileUpload = multer({ storage: storage, fileFilter: fileFilter })

export default fileUpload

export const deleteFile = async (fileName: string) => {
  const filePath = "../uploads/" + fileName
  fs.unlink(filePath, () => {})
}
