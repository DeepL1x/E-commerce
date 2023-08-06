import { Router, raw } from "express"
import auth from "./auth"
import users from "./users"
import items from "./items"
import reviews from "./reviews"
import shops from "./shops"
import imgs from "./imgs"
import sections from "./sections"
import payments from "./payments"
import { stripeWebhook } from "../controllers/payment"
import Routes from "./routes"
import middlewares from "./middlewares"

const router = Router()

export default (): Router => {
  router.post(
    `/${Routes.PAYMENTS}/webhook`,
    raw({ type: "application/json" }),
    stripeWebhook
  )
  middlewares(router)
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
