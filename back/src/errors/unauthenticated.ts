import { CustomAPIError } from "./custom-error"
import { StatusCodes } from "http-status-codes"

export  class UnauthenticatedError extends CustomAPIError {
  statusCode: StatusCodes
  
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}
