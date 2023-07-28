import {
  createShop,
  deleteShop,
  getAllShops,
  getFullShop,
  getShopAccessStatus,
  getShopItems,
  updateShop,
} from "../controllers/shops"
import { auth, isOwnerOfShop } from "../middlewares/auth"
import express from "express"
import Routes from "./routes"
import fileUpload from "../middlewares/fileUpload"
import { shopValidation } from "../middlewares/validations"

export default (router: express.Router) => {
  router.get(`/${Routes.SHOPS}/all`, getAllShops)
  router.get(`/${Routes.SHOPS}/:shopId/items`, shopValidation, getShopItems)
  router.get(
    `/${Routes.SHOPS}/get-access-status/:shopId`,
    auth,
    shopValidation,
    getShopAccessStatus
  )
  router.get(`/${Routes.SHOPS}/:shopId/full`, shopValidation, getFullShop)
  router.post(
    `/${Routes.SHOPS}`,
    auth,
    fileUpload.single("image"),
    shopValidation,
    createShop
  )
  router.put(
    `/${Routes.SHOPS}/:shopId`,
    auth,
    isOwnerOfShop,
    fileUpload.single("image"),
    shopValidation,
    updateShop
  )
  router.delete(
    `/${Routes.SHOPS}/:shopId`,
    auth,
    isOwnerOfShop,
    shopValidation,
    deleteShop
  )
}
