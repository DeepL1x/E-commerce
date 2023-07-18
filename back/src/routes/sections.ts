import {
  createSection,
  deleteSection,
  getAllSections,
  getSection,
  updateSection,
} from "controllers/sections"
import { Request, Router } from "express"
import { auth, isOwnerOfShop } from "middlewares/auth"
import multer from "multer"

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req: Request, file: Express.Multer.File, cb) {
    //@ts-ignore
    const fileName = "" + req.user.userId + "_" + Date.now()
    cb(null, fileName)
  },
})

const upload = multer({ storage: storage })

export default (router: Router) => {
  router.get("/sections/all", getAllSections)
  router.get("/sections/:id", getSection)
  router.post("/sections", auth, isOwnerOfShop, upload.fields, createSection)
  router.put("/sections", auth, isOwnerOfShop, updateSection)
  router.delete("/sections", auth, isOwnerOfShop, deleteSection)
}
