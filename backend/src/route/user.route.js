import { Router } from "express";
import { registerUser,loginUser, logout } from "../controller/user.controller.js";
import auth from "../middleware/authorization.js";

const userRouter =Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').post(logout)


export default userRouter