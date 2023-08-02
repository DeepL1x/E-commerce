import { PrismaClient, Review, Shop, User } from "@prisma/client"
import { UnauthenticatedError } from "../errors/unauthenticated"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { NotFoundError } from "errors"

const prisma = new PrismaClient()

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies

  if (!token) {
    throw new UnauthenticatedError("No token provided")
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as User

    res.locals.user = payload
    req.user = payload

    return next()
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route")
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user

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
  const user: User = res.locals.user

  const { shopId, sectionId } = req.params
  if (user.role && user.role === "admin") {
    return next()
  }
  let shop
  if (shopId) {
    shop = await prisma.shop.findUnique({
      where: { shopId: shopId },
    })
  } else if (sectionId) {
    const section = await prisma.section.findUnique({
      where: { sectionId: Number(sectionId) },
      include: {
        shop: true,
      },
    })
    if (section) {
      shop = section.shop
    } else {
      throw new NotFoundError("Section not found")
    }
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
  const user: User = res.locals.user
  const { itemId } = req.params
  if (user.role && user.role === "admin") {
    return next()
  }
  const item = await prisma.item.findUnique({
    where: {
      itemId: Number(itemId),
    },
  })
  if (!item) {
    throw new NotFoundError("Item not found")
  }
  if (user.userId !== item.userId) {
    throw new UnauthenticatedError("Not allowed to access this route")
  }
  return next()
}

export const isOwnerOfReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = res.locals.user
  const { reviewId } = req.params
  if (user.role && user.role === "admin") {
    return next()
  }
  const review = await prisma.review.findUnique({
    where: { reviewId: Number(reviewId) },
  })
  if (!review) {
    throw new NotFoundError("Review not found")
  }
  if (user.userId !== review.userId) {
    throw new UnauthenticatedError("Not allowed to access this route")
  }
  return next()
}
