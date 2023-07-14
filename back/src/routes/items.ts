import { createItem, deleteItem, getItemById, getItemReviews, getItemsByFilter, updateItem } from "../controllers/items"
import { auth, isOwnerOfItem, isOwnerOfShop } from "../middlewares/auth"
import express from "express"

export default (router: express.Router) => {
  router.get(`/${process.env.ITEMS_ROUTE}/filter`, getItemsByFilter)
  router.get(`/${process.env.ITEMS_ROUTE}/:itemId/reviews`, getItemReviews)
  router.get(`/${process.env.ITEMS_ROUTE}/:itemId`, getItemById)
  router.post(`/${process.env.ITEMS_ROUTE}/`, auth, isOwnerOfShop, createItem)
  router.put(`/${process.env.ITEMS_ROUTE}/`, auth, isOwnerOfItem, updateItem)
  router.delete(`/${process.env.ITEMS_ROUTE}/`, auth, isOwnerOfItem, deleteItem)
}
