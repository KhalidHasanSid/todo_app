
import { apiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getUser } from "../utils/authService.js";

const  auth= asyncHandler(async( req, res ,next)=>{
    console.log("chk 123")
    const token = req.cookies?.uid|| req.header("Authorization")?.replace("Bearer ", "")

if(!token)  throw new apiError(401,"token not find")

    const  user =getUser(token)
    if(!user)
        throw new apiError(400,"usernot exist middle say")

    req.user =user
     console.log("chk 12345")
    next();
})

export default auth