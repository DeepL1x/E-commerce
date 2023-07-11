import { UnauthenticatedError } from "../errors/unauthenticated"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

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
