import { PrismaClient, Shop, User } from "@prisma/client"
import { Request, Response } from "express"

const prisma = new PrismaClient()

export const getAllShops = async (req: Request, res: Response) => {
  const shops: Shop[] = await prisma.shop.findMany()
  return res.status(200).json(shops)
}

export const createShop = async (req: Request, res: Response) => {
  const req_shop: Shop = req.body
  //@ts-ignore
  const user: User = req.user

  const res_shop = await prisma.shop.create({
    data: { name: req_shop.name, userId: user.userId },
  })
  return res.status(200).json(res_shop)
}

export const updateShop = async (req: Request, res: Response) => {
  const req_shop: Shop = req.body
  const res_shop = await prisma.shop.update({
    where: { shopId: req_shop.shopId },
    data: req_shop,
  })
  return res.status(200).json(res_shop)
}

export const getShopsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params
  const shops: Shop[] = await prisma.shop.findMany({
    where: {
      userId: Number(userId),
    },
  })
  return res.status(200).json(shops)
}

export const deleteShop = async (req: Request, res: Response) => {
  const { shopId } = req.body
  const deleted_shop = await prisma.shop.delete({
    where: { shopId: shopId },
  })
  return res.status(200).json(deleted_shop)
}
