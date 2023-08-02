import { StatusCodes } from "http-status-codes"

export class CustomAPIError extends Error {
  code: number
  constructor(message: string, code: number) {
    super(message)
    this.code = code
  }
}