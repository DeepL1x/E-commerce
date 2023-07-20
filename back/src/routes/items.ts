import fileUpload from "../middlewares/fileUpload"
import {
  createItem,
  deleteItem,
  getItemById,
  getItemReviews,
  getItemsByFilter,
  updateItem,
} from "../controllers/items"
import { auth, isOwnerOfItem, isOwnerOfShop } from "../middlewares/auth"
import express from "express"
import Routes from "./routes"
import { itemValidation } from "../middlewares/validations"

export default (router: express.Router) => {
  router.get(`/${Routes.ITEMS}/filter`, getItemsByFilter)
  router.get(`/${Routes.ITEMS}/:itemId/reviews`, itemValidation, getItemReviews)
  router.get(`/${Routes.ITEMS}/:itemId`, itemValidation, getItemById)
  router.post(
    `/${Routes.ITEMS}`,
    auth,
    itemValidation,
    isOwnerOfShop,
    fileUpload.fields([
      { name: "cover", maxCount: 1 },
      { name: "gallery", maxCount: 8 },
    ]),
    createItem
  )
  router.put(
    `/${Routes.ITEMS}`,
    auth,
    itemValidation,
    isOwnerOfItem,
    fileUpload.fields([
      { name: "cover", maxCount: 1 },
      { name: "gallery", maxCount: 8 },
    ]),
    updateItem
  )
  router.delete(
    `/${Routes.ITEMS}`,
    auth,
    itemValidation,
    isOwnerOfItem,
    deleteItem
  )
}
