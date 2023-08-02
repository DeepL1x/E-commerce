import express from "express"
import auth from "./auth"
import users from "./users"
import items from "./items"
import reviews from "./reviews"
import shops from "./shops"
import imgs from "./imgs"
import sections from "./sections"
import payments from "./payments"
const router = express.Router()

export default (): express.Router => {
  auth(router)
  users(router)
  items(router)
  reviews(router)
  shops(router)
  sections(router)
  imgs(router)
  payments(router)
  return router
}
