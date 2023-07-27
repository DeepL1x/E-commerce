import { PrismaClient, Review, Shop, User } from "@prisma/client"
import { UnauthenticatedError } from "../errors/unauthenticated"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies

  if (!token) {
    throw new UnauthenticatedError("No token provided")
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    //@ts-ignore
    req.user = payload

    return next()
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route")
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  //@ts-ignore
  const user: User = req.user

  if (!user.role || user.role !== "admin") {
    throw new UnauthenticatedError("Not allowed to access this route")
  }

  return next()
}

export const isOwnerOfShop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //@ts-ignore
  const user: User = req.user
  const { shopId } = req.params
  if (user.role && user.role === "admin") {
    return next()
  }
  let shop
  if (shopId) {
    shop = await prisma.shop.findUnique({
      where: { shopId: shopId },
    })
  } else {
    shop = await prisma.shop.findUnique({
      where: { shopId: req.body.shopId },
    })
  }

  if (shop && user.userId !== shop.userId) {
    throw new UnauthenticatedError("Not allowed to access this route")
  }
  return next()
}

export const isOwnerOfItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //@ts-ignore
  const user: User = req.user
  const { itemId } = req.params
  if (user.role && user.role === "admin") {
    return next()
  } else if (
    user.userId !==
    (
      await prisma.item.findUnique({
        where: {
          itemId: Number(itemId),
        },
      })
    ).userId
  ) {
    throw new UnauthenticatedError("Not allowed to access this route")
  }
  return next()
}

export const isOwnerOfReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //@ts-ignore
  const user: User = req.user
  const review: Review = req.body
  const { reviewId } = req.params
  if (user.role && user.role === "admin") {
    return next()
  } else if (
    user.userId !==
    (
      await prisma.review.findUnique({
        where: { reviewId: Number(reviewId) },
      })
    ).userId
  ) {
    throw new UnauthenticatedError("Not allowed to access this route")
  }
  return next()
}
