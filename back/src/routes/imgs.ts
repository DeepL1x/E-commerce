import multer from "multer"
import { getImg, saveImg } from "../controllers/imgs"
import { Router, Request } from "express"
import { auth } from "../middlewares/auth"

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req: Request, file: Express.Multer.File, cb) {
    //@ts-ignore
    const fileName = "" + req.user.userId + "_" + Date.now() + "_." + file.originalname.split(".").findLast()
    cb(null, fileName)
  },
})

const upload = multer({ storage: storage })

export default (router: Router) => {
  router.get("/imgs/:imgName", getImg)
  router.post("/imgs", auth, upload.any(), saveImg)
}
