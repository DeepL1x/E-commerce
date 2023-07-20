import { getImg, saveImg } from "../controllers/imgs"
import { Router, Request } from "express"
import { auth } from "../middlewares/auth"
import fileUpload from "../middlewares/fileUpload"
import Routes from "./routes"

export default (router: Router) => {
  router.get(`/${Routes.IMGS}/:imgName`, getImg)
  router.post(`/${Routes.IMGS}`, auth, fileUpload.any(), saveImg)
}
