import { Item, PrismaClient, Shop, User } from "@prisma/client"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import Routes from "../routes/routes"
import { NotFoundError } from "../errors/not-found"
import { deleteFile } from "../middlewares/fileUpload"

const prisma = new PrismaClient()

export const getAllShops = async (req: Request, res: Response) => {
  const shops: Shop[] = await prisma.shop.findMany()
  return res.status(StatusCodes.OK).json(shops)
}

export const createShop = async (req: Request, res: Response) => {
  const req_shop: Shop = req.body
  const file = req.file as Express.Multer.File

  if (file) {
    req_shop.shopImage =
      `http://localhost:${process.env.PORT}/${process.env.API_URL}/${Routes.IMGS}/` +
      file.filename
  }

  const res_shop = await prisma.shop.create({
    data: req_shop,
  })
  return res.status(StatusCodes.CREATED).json(res_shop)
}

export const updateShop = async (req: Request, res: Response) => {
  const req_shop: Shop = req.body
  const { shopId } = req.params
  const file = req.file as Express.Multer.File

  if (req_shop.name) {
    req_shop.shopId = req_shop.name.toLocaleLowerCase().replace(" ", "-")
  }

  if (file) {
    const oldImg = (await prisma.shop.findUnique({ where: { shopId: shopId } }))
      ?.shopImage

    deleteFile(oldImg.split("/").pop())
    req_shop.shopImage =
      `http://localhost:${process.env.PORT}/${process.env.API_URL}/${Routes.IMGS}/` +
      file.filename
  }

  const res_shop = await prisma.shop.update({
    where: { shopId: shopId },
    data: req_shop,
  })
  return res.status(StatusCodes.OK).json(res_shop)
}

export const getShopsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params
  const shops: Shop[] = await prisma.shop.findMany({
    where: {
      userId: Number(userId),
    },
  })
  return res.status(StatusCodes.OK).json(shops)
}

export const deleteShop = async (req: Request, res: Response) => {
  const { shopId } = req.params
  const deleted_shop = await prisma.shop.delete({
    where: { shopId: shopId },
  })
  if (deleted_shop.shopImage) {
    deleteFile(deleted_shop.shopImage.split("/").pop())
  }
  return res.status(StatusCodes.OK).json(deleted_shop)
}

export const getShopItems = async (req: Request, res: Response) => {
  const { shopId } = req.params
  const items: Item[] = (
    await prisma.shop.findUnique({
      where: {
        shopId: shopId,
      },
      include: {
        items: true,
      },
    })
  )?.items
  if (!items) {
    throw new NotFoundError("Items of specified shop not found")
  }
  return res.status(StatusCodes.OK).json(items)
}

export const getFullShop = async (req: Request, res: Response) => {
  const { shopId } = req.params
  const shop: Shop = await prisma.shop.findUnique({
    where: {
      shopId: shopId,
    },
    include: {
      sections: {
        orderBy: {
          order: "asc",
        },
      },
    },
  })
  return res.status(StatusCodes.OK).json(shop)
}
