import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"
import { CustomAPIError } from "errors/custom-error"

export const errorHandlerMiddleware = (
  err: CustomAPIError,
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
  return res.status(customError.statusCode).json({ msg: customError.msg })
}
