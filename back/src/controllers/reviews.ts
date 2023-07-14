import { PrismaClient, Review } from "@prisma/client"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

const prisma = new PrismaClient()

export const getReviewsByFilter = async (req: Request, res: Response) => {
  const params = req.params

  const reviews: Review[] = await prisma.review.findMany({
    where: params,
  })
  return res.status(StatusCodes.OK).json(reviews)
}

export const createReview = async (req: Request, res: Response) => {
  const req_review: Review = req.body
  //@ts-ignore
  req_review.userId = req.user.userId
  const created_review = await prisma.review.create({
    data: req_review,
  })
  return res.status(StatusCodes.CREATED).json(created_review)
}

export const updateReview = async (req: Request, res: Response) => {
  const req_review: Review = req.body
  const updated_review = await prisma.review.update({
    where: {
      reviewId: req_review.reviewId,
    },
    data: req_review,
  })
  return res.status(StatusCodes.OK).json(updated_review)
}

export const deleteReview = async (req: Request, res: Response) => {
  const req_review: Review = req.body
  const deleted_review = await prisma.review.delete({
    where: {
      reviewId: req_review.reviewId,
    },
  })
  return res.status(StatusCodes.OK).json(deleted_review)
}
