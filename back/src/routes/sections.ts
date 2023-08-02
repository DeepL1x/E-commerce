import {
  createSection,
  deleteSection,
  getAllSections,
  getSection,
  updateSection,
} from "../controllers/sections"
import { Router } from "express"
import { auth, isOwnerOfShop } from "../middlewares/auth"
import Routes from "./routes"
import fileUpload from "../middlewares/fileUpload"
import { sectionValidation } from "../middlewares/validations"

export default (router: Router) => {
  router.get(`/${Routes.SECTIONS}/all`, getAllSections)
  router.get(`/${Routes.SECTIONS}/:sectionId`, getSection)
  router.post(
    `/${Routes.SECTIONS}/:shopId`,
    auth,
    isOwnerOfShop,
    fileUpload.array("images", 5),
    sectionValidation,
    createSection
  )
  router.put(
    `/${Routes.SECTIONS}/:sectionId`,
    auth,
    isOwnerOfShop,
    fileUpload.array("images", 5),
    sectionValidation,
    updateSection
  )
  router.delete(
    `/${Routes.SECTIONS}/:sectionId`,
    auth,
    isOwnerOfShop,
    sectionValidation,
    deleteSection
  )
}
