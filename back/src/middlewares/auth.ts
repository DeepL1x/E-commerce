import { PrismaClient, Review, User } from "@prisma/client"
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

  if (user.role && user.role === "admin") {
    return next()
  } else if (
    user.userId !==
    (
      await prisma.shop.findUnique({
        where: { shopId: req.body.shopId },
      })
    ).userId
  ) {
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

  if (user.role && user.role === "admin") {
    return next()
  } else if (
    user.userId !==
    (
      await prisma.item.findUnique({
        where: {
          itemId: req.body.itemId,
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
  if (user.role && user.role === "admin") {
    return next()
  } else if (
    user.userId !==
    (
      await prisma.review.findUnique({
        where: { reviewId: review.reviewId },
      })
    ).userId
  ) {
    throw new UnauthenticatedError("Not allowed to access this route")
  }
  return next()
}
