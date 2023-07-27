import { PrismaClient, Shop } from "@prisma/client"
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
  //@ts-ignore
  const user: User = req.user

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
  //@ts-ignore
  const { email } = req.user.email

  const user = await prisma.user.update({
    where: { email: email },
    data: { username: username },
  })
  return res.status(StatusCodes.OK).json(user)
}

export const deleteUser = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = number(req.user.userId)

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
