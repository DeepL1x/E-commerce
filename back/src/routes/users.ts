import { deleteUser, deleteUserById, getAllUsers, getUserByEmail, updateUser, getUserShops } from "../controllers/users"
import { isAdmin, auth } from "../middlewares/auth"
import express from "express"
import Routes from "./routes"

export default (router: express.Router) => {
    router.get(`/${Routes.USERS}/all`, auth, isAdmin, getAllUsers)
    router.get(`/${Routes.USERS}/shops`, auth, getUserShops)
    router.get(`/${Routes.USERS}/:email`, auth, getUserByEmail)
    router.put(`/${Routes.USERS}/`, auth, updateUser)
    router.delete(`/${Routes.USERS}/`, auth, deleteUser)
    router.delete(`/${Routes.USERS}/:id`, auth, isAdmin, deleteUserById)
}