import { Router, Request, Response } from "express";
import userController from "../controllers/user.controller";
import { cookieAuthCheck } from "../middleware/auth";

const userRouter = Router()

userRouter.get('/users', userController.getUsers)
userRouter.post('/signup', userController.addUser)
userRouter.get('/user/:id', userController.getUserById)
userRouter.get('/username/:username', userController.getUserByUsername)
userRouter.put('/user/:id', userController.updateUserById)
userRouter.delete('/user/:id', userController.deleteUserById)
userRouter.post('/login', userController.loginUser)
userRouter.get('/check-auth', cookieAuthCheck,userController.userProfile)
userRouter.post('/logout', userController.logoutUser)

export default userRouter;