import { PrismaClient, Section } from "@prisma/client"
import e, { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()

const prisma = new PrismaClient()
const imgURL = process.env.IMG_STORAGE_URL

// {
//   fileName: file.filename,
//   fileType: file.mimetype,
// }

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

  const createdSection = await prisma.section.create({ data: section })

  if (files) {
    const imgUrls = files.map((value) => imgURL + value.filename)
    createdSection.imgUrls = imgUrls
  }

  return res.status(StatusCodes.CREATED).json(createdSection)
}

export const updateSection = async (req: Request, res: Response) => {
  const section: Section = req.body
  const fileIndexes = req.body.fileIndexes as number[]
  const files = req.files as Express.Multer.File[]

  if (fileIndexes && files) {
    const newImgUrls = files.map((value) => imgURL + value)
    const oldUrls = (
      await prisma.section.findUnique({
        where: { sectionId: section.sectionId },
      })
    ).imgUrls
    const MaxIndex = oldUrls.length - 1

    fileIndexes.forEach((value: number, index: number) => {
      if (value > MaxIndex) {
        value = MaxIndex + 1
      }

      const oldFile = "../upload/" + oldUrls[value].split("/").pop()

      fs.unlink(oldFile, () => {})

      oldUrls[value] = newImgUrls[index]
    })
  }

  const updatedSection = await prisma.section.update({
    where: { sectionId: section.sectionId },
    data: section,
  })

  return res.status(StatusCodes.OK).json(updatedSection)
}

export const deleteSection = async (req: Request, res: Response) => {
  const { sectionId } = req.body
  await prisma.section.delete({ where: { sectionId: sectionId } })
  return res.status(StatusCodes.OK).end()
}
