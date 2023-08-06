import { PrismaClient, Item, Review } from "@prisma/client"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { deleteFile } from "../middlewares/fileUpload"
import { NotFoundError, BadRequestError } from "../errors"

const prisma = new PrismaClient()

export const createItem = async (req: Request, res: Response) => {
  const fileIndexes = req.body.indexes as number[]
  delete req.body.indexes
  const deleteIndexes = req.body.deleteIndexes as number[]
  delete req.body.deleteIndexes
  const req_item = req.body as Item
  const { shopId } = req.params
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  const cover = files["cover"] ? files["cover"][0] : null
  const gallery = files["galley"]

  await manageItemFiles(cover, gallery, fileIndexes, req_item, deleteIndexes)

  const created_item: Item = await prisma.item.create({
    data: { ...req_item, shopId },
  })
  return res.status(StatusCodes.CREATED).json(created_item)
}

export const updateItem = async (req: Request, res: Response) => {
  const fileIndexes = req.body.indexes as number[]
  delete req.body.indexes
  const deleteIndexes = req.body.deleteIndexes as number[]
  delete req.body.deleteIndexes
  const deleteCover = req.body.deleteCover as boolean
  delete req.body.deleteCover
  const req_item: Item = req.body
  const { itemId } = req.params
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }

  const cover = files["cover"] ? files["cover"][0] : null
  const gallery = files["galley"]

  await manageItemFiles(
    cover,
    gallery,
    fileIndexes,
    req_item,
    deleteIndexes,
    itemId,
    deleteCover
  )

  const updated_item: Item = await prisma.item.update({
    where: {
      itemId: Number(itemId),
    },
    data: req_item as Item,
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
  if (!item) {
    throw new NotFoundError("Item not found")
  }
  return res.status(StatusCodes.OK).json(item)
}

export const deleteItem = async (req: Request, res: Response) => {
  const { itemId } = req.params
  const deleted_item = await prisma.item.delete({
    where: {
      itemId: Number(itemId),
    },
  })
  if (deleted_item.coverImg) {
    deleteFile(deleted_item.coverImg.split("/").pop())
  }
  if (deleted_item.imgUrls) {
    deleted_item.imgUrls.forEach((url) => {
      deleteFile(url.split("/").pop())
    })
  }
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
  const item = await prisma.item.findUnique({
    where: {
      itemId: Number(itemId),
    },
    include: {
      reviews: true,
    },
  })
  if (!item) {
    throw new NotFoundError("Item not found")
  }
  const reviews = item.reviews
  return res.status(StatusCodes.OK).json(reviews)
}

const manageItemFiles = async (
  cover: Express.Multer.File | null,
  files: Express.Multer.File[] | null,
  fileIndexes: number[] | null,
  item: Item,
  deleteIndexes: number[],
  itemId?: string,
  deleteCover?: boolean
) => {
  if (cover) {
    if (itemId) {
      const oldCover = (
        await prisma.item.findUnique({
          where: { itemId: Number(itemId) },
        })
      ).coverImg
      if (oldCover) {
        deleteFile(oldCover.split("/").pop())
      }
    }
    item.coverImg =
      `http://localhost:${process.env.PORT}/${process.env.IMG_STORAGE_URL}/` +
      cover.filename
  }

  if (itemId) {
    if (fileIndexes && fileIndexes.length > 0) {
      const MaxIndex = 8
      fileIndexes.forEach((value) => {
        if (value >= MaxIndex) {
          throw new BadRequestError("File index is out of range")
        }
      })

      if (files && files.length > 0) {
        const oldUrls = (
          await prisma.item.findUnique({
            where: { itemId: Number(itemId) },
          })
        ).imgUrls

        const newImgUrls = files.map(
          (file) =>
            `http://localhost:${process.env.PORT}/${process.env.IMG_STORAGE_URL}/` +
            file.filename
        )

        fileIndexes.forEach((value: number, index: number) => {
          if (oldUrls[value]) {
            deleteFile(oldUrls[value].split("/").pop())
          }
          oldUrls[value] = newImgUrls[index] ? newImgUrls[index] : null
        })
        item.imgUrls = oldUrls
      }
    }

    if (deleteIndexes && deleteIndexes.length > 0) {
      const oldUrls = (
        await prisma.item.findUnique({
          where: { itemId: Number(itemId) },
        })
      ).imgUrls

      deleteIndexes.forEach((value: number) => {
        if (oldUrls[value]) {
          deleteFile(oldUrls[value].split("/").pop())
        }
      })

      item.imgUrls = oldUrls.filter(
        (_, index) => !deleteIndexes.includes(index)
      )
    }
    if (deleteCover) {
      item.coverImg = null
      const oldCover = (
        await prisma.item.findUnique({
          where: { itemId: Number(itemId) },
        })
      ).coverImg
      if (oldCover) {
        deleteFile(oldCover.split("/").pop())
      }
    }
  } else {
    if (files && files.length > 0) {
      const newImgUrls = files.map(
        (file) =>
          `http://localhost:${process.env.PORT}/${process.env.IMG_STORAGE_URL}/` +
          file.filename
      )
      item.imgUrls = newImgUrls
    }
  }
}
