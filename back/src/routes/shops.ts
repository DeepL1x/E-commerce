import { createShop, deleteShop, getAllShops, getShopsByUserId, updateShop } from "../controllers/shops"
import { auth, isOwnerOfShop } from "../middlewares/auth"
import express from "express"

export default (router: express.Router) => {
  router.get(`/${process.env.SHOPS_ROUTE}/all`, getAllShops)
  router.get(`/${process.env.SHOPS_ROUTE}/:id`, getShopsByUserId)
  router.post(`/${process.env.SHOPS_ROUTE}/`, auth, createShop )
  router.put(`/${process.env.SHOPS_ROUTE}/`, auth, isOwnerOfShop, updateShop )
  router.delete(`/${process.env.SHOPS_ROUTE}/`, auth, isOwnerOfShop, deleteShop )
}
