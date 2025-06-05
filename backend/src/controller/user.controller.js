import  User  from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { v4 as uuidv4 } from 'uuid';
import { getUser, setUser } from "../utils/authService.js";


const registerUser =asyncHandler(async(req,res, err)=>{
    const  {username, email,password }=req.body
  
    if(!username||!email || !password)  { throw new apiError(400,"you miss a variable")}





      const existUser = await User.findOne({email:email})

     

      if(existUser){ 
       
        throw new apiError(399,"patient already exist")}  
        

      const newUser= await User.create({
       username:username,
        email:email,
        password:password
       



      })
      console.log("------------------------------------------------------")
       console.log(newUser)
       
       if(!newUser)
       throw new apiError(409,"something went wrong while registration")




  
     res.json(new ApiResponse(200,newUser,"successsfull"))
})



// const login =()=>asyncHandler(async(req,res,err)=>{
//   console.log("==============")
//    const {username  ,password} =req.body
//    console.log("hello world")
//    if(!username || !password)
//     throw new apiError(400,"something missing!")

//    const existUser = await User.findOne({
//     $or: [
//       { username: username },
//       { email: username }
//     ]
//   })
//   if(!existUser)
//     throw new apiError(400,"something missing!")

//   const authenticated = existUser.validatePassword(password)

//   if(!authenticated)

//     throw new apiError(400,"Invalid Password!")

//   const sessionID =uuidv4()

//   setUser(sessionID,existUser)
//    console.log(getUser(sessionID))


//   res.cookie("uid", sessionID, {
//           httpOnly: true,
//           secure: true,
//           sameSite: "lax",
//         }).json( new ApiResponse(200,  "Login successful"))
  
  

  



// })

const loginUser = asyncHandler(async(req,res,err)=>{
  const {username  ,password} =req.body
   console.log("hello world")
   if(!username || !password)
    throw new apiError(400,"something missing!")

   const existUser = await User.findOne({
    $or: [
      { username: username },
      { email: username }
    ]
  })
  if(!existUser)
    throw new apiError(400,"something missing!")

  const authenticated = existUser.validatePassword(password)

  if(!authenticated)

    throw new apiError(400,"Invalid Password!")

  const sessionID =uuidv4()

  setUser(sessionID,existUser)
   


  res.cookie("uid", sessionID, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        }).json( new ApiResponse(200,  "Login successful"))
  

})


export {registerUser,loginUser}