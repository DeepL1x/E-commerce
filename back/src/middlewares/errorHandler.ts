import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"
import { CustomAPIError } from "errors/custom-error"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export const errorHandlerMiddleware = (
  err: CustomAPIError | PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = {
    // @ts-ignore
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    // @ts-ignore
    msg: err.message || "Something went wrong try again later",
  }

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      customError.msg = `Record not found`
      customError.statusCode = StatusCodes.NOT_FOUND
    } else if (err.code === "P2002") {
      customError.msg = `Duplicate value entered for ${
        //@ts-ignore
        err.meta.target[0] === "shopId" ? "name" : err.meta.target
      }`
      customError.statusCode = StatusCodes.BAD_REQUEST
    }
    else {
      customError.msg = "Something went wrong try again later..."
    }
  }

  console.log(err)

  return res.status(customError.statusCode).json({ msg: customError.msg })
}
