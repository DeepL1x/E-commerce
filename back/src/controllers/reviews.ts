import { PrismaClient, Review } from "@prisma/client"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import url from "url"

const prisma = new PrismaClient()

export const getReviewsByItem = async (req: Request, res: Response) => {
  const { shopId: itemId } = req.params
  const reviews: Review[] = await prisma.review.findMany({
    where: {
      itemId: Number(itemId),
    },
  })
  return res.status(StatusCodes.OK).json(reviews)
}

export const getReviewsByFilter = async (req: Request, res: Response) => {
  const query = url.parse(req.url).query
  let filter
  if (query) {
    filter = JSON.parse(decodeURIComponent(query))
  }
  const reviews: Review[] = await prisma.review.findMany({
    where: filter,
  })
  return res.status(StatusCodes.OK).json(reviews)
}

export const createReview = async (req: Request, res: Response) => {
  const req_review: Review = req.body
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
