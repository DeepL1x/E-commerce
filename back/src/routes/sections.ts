import {
  createSection,
  deleteSection,
  getAllSections,
  getSection,
  updateSection,
} from "controllers/sections"
import { Router } from "express"
import { auth, isOwnerOfShop } from "middlewares/auth"
import Routes from "./routes"
import fileUpload from "../middlewares/fileUpload"

export default (router: Router) => {
  router.get(`/${Routes.SECTIONS}/all`, getAllSections)
  router.get(`/${Routes.SECTIONS}/:id`, getSection)
  router.post(
    `/${Routes.SECTIONS}`,
    auth,
    isOwnerOfShop,
    fileUpload.array("images", 5),
    createSection
  )
  router.put(
    `/${Routes.SECTIONS}`,
    auth,
    isOwnerOfShop,
    fileUpload.array("images", 5),
    updateSection
  )
  router.delete(`/${Routes.SECTIONS}`, auth, isOwnerOfShop, deleteSection)
}
