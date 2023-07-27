import { PrismaClient, Section } from "@prisma/client"
import e, { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import dotenv from "dotenv"
import { BadRequestError } from "../errors/bad-request"
import { deleteFile } from "../middlewares/fileUpload"
dotenv.config()

const prisma = new PrismaClient()

export const getSection = async (req: Request, res: Response) => {
  const { sectionId } = req.params
  const section: Section = await prisma.section.findUnique({
    where: { sectionId: Number(sectionId) },
  })
  return res.status(StatusCodes.OK).json(section)
}

export const getAllSections = async (req: Request, res: Response) => {
  const sections: Section[] = await prisma.section.findMany()
  return res.status(StatusCodes.OK).json(sections)
}

export const createSection = async (req: Request, res: Response) => {
  const section: Section = req.body
  const files = req.files as Express.Multer.File[]

  if (files) {
    const imgUrls = files.map(
      (file) =>
        `http://localhost:${process.env.PORT}/${process.env.IMG_STORAGE_URL}/` +
        file.filename
    )
    section.imgUrls = imgUrls
  }

  const createdSection = await prisma.section.create({ data: section })

  return res.status(StatusCodes.CREATED).json(createdSection)
}

export const updateSection = async (req: Request, res: Response) => {
  const req_section: Section = req.body
  
  const fileIndexes = req.body.fileIndexes as number[]
  const files = req.files as Express.Multer.File[]

  if (fileIndexes && files) {
    const MaxIndex = 5

    fileIndexes.forEach((value) => {
      if (value >= MaxIndex) {
        throw new BadRequestError("File index is out of range")
      }
    })

    const newImgUrls = files.map(
      (file) =>
        `http://localhost:${process.env.PORT}/${process.env.IMG_STORAGE_URL}/` +
        file.filename
    )
    const oldUrls = (
      await prisma.section.findUnique({
        where: { sectionId: req_section.sectionId },
      })
    ).imgUrls

    fileIndexes.forEach((value: number, index: number) => {
      deleteFile(oldUrls[value].split("/").pop())
      oldUrls[value] = newImgUrls[index]
    })

    req_section.imgUrls = oldUrls
  }

  const updatedSection = await prisma.section.update({
    where: { sectionId: req_section.sectionId },
    data: req_section,
  })

  return res.status(StatusCodes.OK).json(updatedSection)
}

export const deleteSection = async (req: Request, res: Response) => {
  const { sectionId } = req.body
  const urls = (
    await prisma.section.findUnique({
      where: { sectionId: sectionId },
    })
  )?.imgUrls
  if (urls) {
    urls.forEach((url) => {
      deleteFile(url.split("/").pop())
    })
  }
  await prisma.section.delete({ where: { sectionId: sectionId } })
  return res.status(StatusCodes.OK).end()
}
