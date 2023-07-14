import { PrismaClient, Item, Review } from "@prisma/client"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

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
  await prisma.item.delete({
    where: {
      itemId: itemId,
    },
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
