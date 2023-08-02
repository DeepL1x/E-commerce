import { Review, Shop, User } from "@prisma/client"
import { BadRequestError } from "../errors/bad-request"
import { NextFunction, Request, Response } from "express"
import { TShop } from "types"
const shopNameRegEx = /^[A-Za-z0-9 ]*$/

const validateShopName = (shopName: string) => {
  if (shopName === "") {
    throw new BadRequestError("Shop name can not be empty!")
  }
  if (!shopNameRegEx.test(shopName)) {
    throw new BadRequestError(
      "Shop name can only contain latin letters and numbers"
    )
  }
}

const shopValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const req_shop: Shop = req.body
  const { shopId } = req.params

  if (req.method === "POST") {
    if (req_shop.name === "") {
      throw new BadRequestError("Shop name is required")
    }

    validateShopName(req_shop.name)
    if (req_shop.tags && req_shop.tags.length > 0) {
      const tags = req.body.tags as string
      req_shop.tags = JSON.parse(tags)
    }

    const user: User = res.locals.user
    req_shop.userId = user.userId
    req_shop.shopId = req_shop.name.toLocaleLowerCase().replace(" ", "-")
  }

  if (req.method === "PUT" || req.method === "DELETE") {
    if (!shopId) {
      throw new BadRequestError("Shop shopId is required")
    }

    if (req_shop.tags && req_shop.tags.length > 0) {
      const tags = req.body.tags as string
      req_shop.tags = JSON.parse(tags)
    }

    if (req_shop.name !== undefined) {
      validateShopName(req_shop.name)
    }
  }

  if (req.method === "GET") {
    if (!req.params.shopId) {
      throw new BadRequestError("Shop shopId is required")
    }
  }

  next()
}

const itemValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const req_item = req.body
  const { itemId } = req.params

  if (req.method === "POST") {
    if (!req_item.name) {
      throw new BadRequestError("Item name is required")
    }
    if (!req_item.shopId) {
      throw new BadRequestError("Item shopId is required")
    }
    req.body.userId = res.locals.user.userId
  }
  if (req.method === "PUT" || req.method === "DELETE") {
    if (!itemId) {
      throw new BadRequestError("Item itemId is required")
    }
  }
  if (req.method === "GET") {
    //TODO add query params validation
    if (!req.params.itemId) {
      throw new BadRequestError("Item itemId is required")
    }
  }
  next()
}

const sectionValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const req_section = req.body
  const { sectionId } = req.params

  if (req.method === "POST") {
    if (!req_section.shopId) {
      throw new BadRequestError("Section shopId is required")
    }
    req.body.userId = res.locals.user.userId
  }
  if (req.method === "PUT" || req.method === "DELETE") {
    if (!sectionId) {
      throw new BadRequestError("Section sectionId is required")
    }
  }

  next()
}

const reviewValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const req_review: Review = req.body
  const { reviewId } = req.params

  if (req.method === "POST") {
    if (!req_review.title) {
      throw new BadRequestError("Review title is required")
      req.body.userId = res.locals.user.userId
    }
    if (!req_review.itemId) {
      throw new BadRequestError("Review itemId is required")
    }
  }
  if (req.method === "PUT" || req.method === "DELETE") {
    if (!reviewId) {
      throw new BadRequestError("Review reviewId is required")
    }
  }

  next()
}

export { shopValidation, itemValidation, sectionValidation, reviewValidation }
