import { PrismaClient, Section } from "@prisma/client"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { deleteFile } from "../middlewares/fileUpload"
import { NotFoundError, BadRequestError } from "../errors"

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
  const section = req.body as Section
  const files = req.files as Express.Multer.File[]

  await manageSectionFiles(files, null, section, null)

  const createdSection = await prisma.section.create({ data: section })

  return res.status(StatusCodes.CREATED).json(createdSection)
}

export const updateSection = async (req: Request, res: Response) => {
  const fileIndexes = req.body.indexes as number[]
  delete req.body.indexes
  const deleteIndexes = req.body.deleteIndexes as number[]
  delete req.body.deleteIndexes
  const req_section: Section = req.body
  const { sectionId } = req.params

  const files = req.files as Express.Multer.File[]

  const section = await prisma.section.findUnique({
    where: { sectionId: Number(sectionId) },
  })
  if (!section) {
    throw new NotFoundError("Section not found")
  }

  await manageSectionFiles(
    files,
    fileIndexes,
    req_section,
    deleteIndexes,
    sectionId
  )

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

const manageSectionFiles = async (
  files: Express.Multer.File[] | null,
  fileIndexes: number[] | null,
  section: Section,
  deleteIndexes: number[],
  sectionId?: string
) => {
  if (sectionId) {
    if (fileIndexes && fileIndexes.length > 0) {
      const MaxIndex = 5
      fileIndexes.forEach((value) => {
        if (value >= MaxIndex) {
          throw new BadRequestError("File index is out of range")
        }
      })
      const oldUrls = (
        await prisma.section.findUnique({
          where: { sectionId: Number(sectionId) },
        })
      ).imgUrls
      if (files && files.length > 0) {
        const newImgUrls = files.map(
          (file) =>
            `http://localhost:${process.env.PORT}/${process.env.IMG_STORAGE_URL}/` +
            file.filename
        )
        fileIndexes.forEach((value: number, index: number) => {
          if (oldUrls[value]) {
            deleteFile(oldUrls[value].split("/").pop())
          }
          oldUrls[value] = newImgUrls[index] ? newImgUrls[index] : null
        })
        section.imgUrls = oldUrls
      }
    }
    if (deleteIndexes && deleteIndexes.length > 0) {
      const old_section = await prisma.section.findUnique({
        where: { sectionId: Number(sectionId) },
      })
      const oldUrls = old_section.imgUrls

      deleteIndexes.forEach((value: number) => {
        if (oldUrls[value]) {
          deleteFile(oldUrls[value].split("/").pop())
        }
      })

      section.imgUrls = oldUrls.filter(
        (_, index) => !deleteIndexes.includes(index)
      )
    } else {
      if (files && files.length > 0) {
        const newImgUrls = files.map(
          (file) =>
            `http://localhost:${process.env.PORT}/${process.env.IMG_STORAGE_URL}/` +
            file.filename
        )
        section.imgUrls = newImgUrls
      }
    }
  }
}
