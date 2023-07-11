import { UnauthenticatedError } from "../errors/unauthenticated"
import { BadRequestError } from "../errors/bad-request"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import * as argon from "argon2"
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"
dotenv.config()

const prisma = new PrismaClient()
const emailRegEx =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const signup = async (req: Request, res: Response) => {
  const { username, password, email } = req.body

  if (!username && !password && !email) {
    throw new BadRequestError("Please provide username, password and email")
  }

  if (!emailRegEx.test(email)) {
    throw new BadRequestError("Invalid email")
  }

  const hash = await argon.hash(password)

  const user = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hash,
    },
  })

  const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  })

  res.cookie("token", token, { httpOnly: true })
  return res
    .status(StatusCodes.CREATED)
    .json({ msg: "User created successfully" })
}

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email && !password) {
    throw new BadRequestError("Please provide username and password")
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (await argon.verify(user.password, password)) {
    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    res.cookie("token", token, { httpOnly: true })
    return res.status(200).json({ msg: "User logged in successfully" })
  } else {
    throw new UnauthenticatedError("Invalid credentials")
  }
}
