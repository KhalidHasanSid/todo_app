
import { apiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getUser } from "../utils/authService.js";

const  auth= asyncHandler(async( req, res ,next)=>{
    
    const token = req.cookies?.uid|| req.header("Authorization")?.replace("Bearer ", "")

if(!token)  throw new apiError(401,"token not find")

    const  user =getUser(token)
    if(!user)
        throw new apiError(400,"usernot exist middle say")

    req.user =user
    console.log("=============Auth END")
    next();
})

export default auth