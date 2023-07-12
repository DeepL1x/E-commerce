import { createReview, deleteReview, getReviewsByFilter, getReviewsByItem, updateReview } from "../controllers/reviews"
import { auth, isOwnerOfReview, isOwnerOfShop } from "../middlewares/auth"
import express from "express"

export default (router: express.Router) => {
  router.get(`/${process.env.REVIEWS_ROUTE}/all`, getReviewsByItem)
  router.get(`/${process.env.REVIEWS_ROUTE}/filter/`, getReviewsByFilter)
  router.post(`/${process.env.REVIEWS_ROUTE}/`, auth, createReview )
  router.put(`/${process.env.REVIEWS_ROUTE}/`, auth, isOwnerOfReview, updateReview )
  router.delete(`/${process.env.REVIEWS_ROUTE}/`, auth, isOwnerOfReview, deleteReview )
}
