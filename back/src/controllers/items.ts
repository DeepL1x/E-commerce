import { PrismaClient, Item } from "@prisma/client"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import url from "url"

const prisma = new PrismaClient()

export const getItemsByShop = async (req: Request, res: Response) => {
  const { name } = req.params
  const items: Item[] = (
    await prisma.shop.findUnique({
      where: {
        name: name,
      },
      include: {
        items: true,
      },
    })
  ).items
  return res.status(StatusCodes.OK).json(items)
}

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
  const query = url.parse(req.url).query
  let filter
  if (query) {
    filter = JSON.parse(decodeURIComponent(query))
  }
  const items: Item[] = await prisma.item.findMany({
    where: filter,
  })
  return res.status(StatusCodes.OK).json(items)
}
