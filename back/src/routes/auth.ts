import { signin, signup } from "../controllers/auth"
import express from "express"


export default (router: express.Router) => {
    router.post(`/${process.env.AUTH_ROUTE}/signin`, signin)
    router.post(`/${process.env.AUTH_ROUTE}/signup`, signup)
}