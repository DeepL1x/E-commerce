import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"

const prisma = new PrismaClient()

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany()
  return res.status(200).json(users)
}

export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.params
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: { userId: true, email: true, username: true },
  })
  return res.status(200).json(user)
}

export const updateUser = async (req: Request, res: Response) => {
  const { username } = req.body
  //@ts-ignore
  const { email } = req.user.email

  const user = await prisma.user.update({
    where: { email: email },
    data: { username: username },
  })
  return res.status(200).json(user)
}

export const deleteUser = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = number(req.user.userId)

  const user = await prisma.user.delete({
    where: { userId: userId },
  })
  return res.status(200).json(user)
}

export const deleteUserById = async (req: Request, res: Response) => {
  const { email } = req.params
  const user = await prisma.user.delete({
    where: { email: email },
  })
  return res.status(200).json(user)
}
