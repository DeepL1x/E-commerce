import { PrismaClient, Item, Review } from "@prisma/client"
import { BadRequestError } from "../errors/bad-request"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { deleteFile } from "../middlewares/fileUpload"

const prisma = new PrismaClient()

export const createItem = async (req: Request, res: Response) => {
  const req_item: Item = req.body
  const created_item: Item = await prisma.item.create({
    data: req_item,
  })
  return res.status(StatusCodes.CREATED).json(created_item)
}

export const updateItem = async (req: Request, res: Response) => {
  const req_item: Item = req.body
  const fileIndexes = req.body.fileIndexes as number[]
  //@ts-ignore
  const cover = req.files["cover"][0] as Express.Multer.File
  //@ts-ignore
  const files = req.files["gallery"] as Express.Multer.File[]

  if (cover) {
    const oldCover = (
      await prisma.item.findUnique({
        where: { itemId: req_item.itemId },
      })
    ).coverImg
    deleteFile(oldCover.split("/").pop())
    req_item.coverImg =
      `http://localhost:${process.env.PORT}/${process.env.IMG_STORAGE_URL}/` +
      cover.filename
  }

  if (fileIndexes && files) {
    const MaxIndex = 8

    fileIndexes.forEach((value) => {
      if (value >= MaxIndex) {
        throw new BadRequestError("File index is out of range")
      }
    })

    const newImgUrls = files.map(
      (file) =>
        `http://localhost:${process.env.PORT}/${process.env.IMG_STORAGE_URL}/` +
        file.filename
    )
    const oldUrls = (
      await prisma.item.findUnique({
        where: { itemId: req_item.itemId },
      })
    ).imgUrls

    fileIndexes.forEach((value: number, index: number) => {
      deleteFile(oldUrls[value].split("/").pop())
      oldUrls[value] = newImgUrls[index]
    })

    req_item.imgUrls = oldUrls
  }
  const updated_item: Item = await prisma.item.update({
    where: {
      itemId: req_item.itemId,
    },
    data: req_item,
  })
  return res.status(StatusCodes.OK).json(updated_item)
}

export const getItemById = async (req: Request, res: Response) => {
  const { itemId } = req.params
  const item: Item = await prisma.item.findUnique({
    where: {
      itemId: Number(itemId),
    },
  })
  return res.status(StatusCodes.OK).json(item)
}

export const deleteItem = async (req: Request, res: Response) => {
  const { itemId } = req.body
  const deleted_item = await prisma.item.delete({
    where: {
      itemId: itemId,
    },
  })
  deleteFile(deleted_item.coverImg.split("/").pop())
  deleted_item.imgUrls.forEach((url) => {
    deleteFile(url.split("/").pop())
  })
  return res.status(StatusCodes.OK).json({ message: "Item deleted" })
}

export const getItemsByFilter = async (req: Request, res: Response) => {
  const params = req.query

  const items: Item[] = await prisma.item.findMany({
    where: params,
  })
  return res.status(StatusCodes.OK).json(items)
}

export const getItemReviews = async (req: Request, res: Response) => {
  const { itemId } = req.params
  console.log(itemId)

  const reviews: Review[] = (
    await prisma.item.findUnique({
      where: {
        itemId: Number(itemId),
      },
      include: {
        reviews: true,
      },
    })
  ).reviews
  return res.status(StatusCodes.OK).json(reviews)
}
