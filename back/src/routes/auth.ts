import { signin, signup } from "../controllers/auth"
import express from "express"
import Routes from "./routes"

export default (router: express.Router) => {
  router.post(`/${Routes.AUTH}/signin`, signin)
  router.post(`/${Routes.AUTH}/signup`, signup)
}
