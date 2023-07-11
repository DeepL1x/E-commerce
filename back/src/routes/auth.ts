import { signin, signup } from "../controllers/auth"
import express from "express"


export default (router: express.Router) => {
    router.post("/auth/signin", signin)
    router.post("/auth/signup", signup)
}