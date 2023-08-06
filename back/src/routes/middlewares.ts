import cookieParser from "cookie-parser"
import cors from "cors"
import { Router, json } from "express"

export default (router: Router) => {
  router.use(json())
  router.use(cookieParser())
  router.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  )
}
