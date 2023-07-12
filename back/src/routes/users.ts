import { deleteUser, deleteUserById, getAllUsers, getUserByEmail, updateUser } from "../controllers/users"
import { isAdmin, auth } from "../middlewares/auth"
import express from "express"

export default (router: express.Router) => {
    router.get(`/${process.env.USERS_ROUTE}/all`, auth, isAdmin, getAllUsers)
    router.get(`/${process.env.USERS_ROUTE}/:email`, auth, getUserByEmail)
    router.put(`/${process.env.USERS_ROUTE}/`, auth, updateUser)
    router.delete(`/${process.env.USERS_ROUTE}/`, auth, deleteUser)
    router.delete(`/${process.env.USERS_ROUTE}/:id`, auth, isAdmin, deleteUserById)
}