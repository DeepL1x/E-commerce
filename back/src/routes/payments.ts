import {
  checkoutCart,
  createCheckoutSession,
  getConfig,
  stripeWebhook,
} from "../controllers/payment"
import { Router, raw } from "express"
import Routes from "./routes"
import { auth } from "../middlewares/auth"
export default (router: Router) => {
  router.get(`/${Routes.PAYMENTS}/config`, getConfig)
  router.post(
    `/${Routes.PAYMENTS}/create-checkout-session`,
    createCheckoutSession
  )
  router.post(`/${Routes.PAYMENTS}/checkout-cart`, auth, checkoutCart)
  
}
