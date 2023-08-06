import { ItemOrder, PrismaClient, Shop, User } from "@prisma/client"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

const prisma = new PrismaClient()

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany()
  return res.status(StatusCodes.OK).json(users)
}

export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.params
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: { userId: true, email: true, username: true },
  })
  return res.status(StatusCodes.OK).json(user)
}

export const getUserShops = async (req: Request, res: Response) => {
  const user: User = res.locals.user

  const userShops: Shop[] = (
    await prisma.user.findUnique({
      where: { userId: user.userId },
      include: {
        shops: true,
      },
    })
  ).shops
  return res.status(StatusCodes.OK).json(userShops)
}

export const updateUser = async (req: Request, res: Response) => {
  const { username } = req.body
  const { email } = res.locals.user

  const user = await prisma.user.update({
    where: { email: email },
    data: { username: username },
  })
  return res.status(StatusCodes.OK).json(user)
}

export const deleteUser = async (req: Request, res: Response) => {
  const userId = Number(res.locals.userId)

  const user = await prisma.user.delete({
    where: { userId: userId },
  })
  return res.status(StatusCodes.OK).json(user)
}

export const deleteUserById = async (req: Request, res: Response) => {
  const { email } = req.params
  const user = await prisma.user.delete({
    where: { email: email },
  })
  return res.status(StatusCodes.OK).json(user)
}

export const addItemToCart = async (req: Request, res: Response) => {
  const { userId } = res.locals.user
  const user = await prisma.user.findUnique({
    where: { userId: userId },
    include: {
      cart: true,
    },
  })
  const items = user?.cart
  for (const item of items) {
    if (item.itemId === req.body.itemId) {
      const result = await prisma.itemOrder.update({
        where: { itemOrderId: item.itemOrderId },
        data: { amount: item.amount + req.body.amount },
      })
      return res.status(StatusCodes.OK).json(result)
    }
  }
  const result = await prisma.itemOrder.create({
    data: { ...req.body, userId: userId },
  })

  return res.status(StatusCodes.OK).json(result)
}

export const deleteItemFromCart = async (req: Request, res: Response) => {
  const { itemOrderId } = req.params

  const result = await prisma.itemOrder.delete({
    where: { itemOrderId: Number(itemOrderId) },
  })

  return res
    .status(StatusCodes.OK)
    .json({ result, message: "deleted successfuly" })
}

export const getUserCart = async (req: Request, res: Response) => {
  const { userId } = res.locals.user

  const cart = (
    await prisma.user.findUnique({
      where: { userId: userId },
      include: {
        cart: {
          include: {
            item: true,
          },
        },
      },
    })
  ).cart

  return res.status(StatusCodes.OK).json(cart)
}
export const updateItemInCart = async (req: Request, res: Response) => {
  const { itemOrderId } = req.params
  const item: ItemOrder = req.body

  const result = await prisma.itemOrder.update({
    where: { itemOrderId: Number(itemOrderId) },
    data: item,
  })

  return res.status(StatusCodes.OK).json(result)
}

export const deleteAllItemsFromCart = async (req: Request, res: Response) => {
  const { userId } = res.locals.user

  const result = await prisma.itemOrder.deleteMany({
    where: { userId: userId },
  })

  return res.status(StatusCodes.OK).json(result)
}

export const getUserOrders = async (req: Request, res: Response) => {
  const { email } = res.locals.user

  const orders = await prisma.order.findMany({
    where: { userEmail: email },
    include: {
      items: true,
    },
  })

  return res.status(StatusCodes.OK).json(orders)
}
