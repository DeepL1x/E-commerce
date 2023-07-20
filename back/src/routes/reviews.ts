import {
  createReview,
  deleteReview,
  getReviewsByFilter,
  updateReview,
} from "../controllers/reviews"
import { auth, isOwnerOfReview } from "../middlewares/auth"
import express from "express"
import Routes from "./routes"
import { reviewValidation } from "../middlewares/validations"

export default (router: express.Router) => {
  router.get(`/${Routes.REVIEWS}/filter/`, getReviewsByFilter)
  router.post(`/${Routes.REVIEWS}/`, auth, reviewValidation, createReview)
  router.put(
    `/${Routes.REVIEWS}/`,
    auth,
    reviewValidation,
    isOwnerOfReview,
    updateReview
  )
  router.delete(
    `/${Routes.REVIEWS}/`,
    auth,
    reviewValidation,
    isOwnerOfReview,
    deleteReview
  )
}
