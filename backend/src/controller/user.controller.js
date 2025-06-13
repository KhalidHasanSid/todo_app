import  User  from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { v4 as uuidv4 } from 'uuid';
import { deleteUser, getUser, setUser,userMap } from "../utils/authService.js";
import apiResponse from "../utils/apiResponse.js";


const registerUser =asyncHandler(async(req,res, err)=>{
    const  {username, email,password }=req.body
  
    if(!username||!email || !password)  { throw new apiError(405,"you miss a variable")}





      const existUser = await User.findOne({email:email})

     

      if(existUser){ 
       
        throw new apiError(399,"user already exist")}  
        

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
   console.log("hello world",username,"=",password)
   if(!username || !password)
    throw new apiError(400,"something missing!")

   const existUser = await User.findOne({
    $or: [
      { username: username },
      { email: username }
    ]
  })
  console.log(existUser)
  if(!existUser)
    throw new apiError(400,"something missing!")

   let authenticated=false 
  authenticated = await existUser.validatePassword(password)
  console.log(authenticated)

  if(!authenticated)

   { throw new apiError(400,"Invalid Password ok!")}

  const sessionID =uuidv4()

  setUser(sessionID,existUser)

  console.log("=============")
   


  res.cookie("uid", sessionID, {
          httpOnly: false,
          secure: false,
          sameSite: "lax",
        }).json( new ApiResponse(200,sessionID,  "Login successful"))
  

})     


const logout= asyncHandler(async(req,res)=>{
  console.log("bbb")
  const token= req.cookies.uid
  

  const logout=deleteUser(token)
  console.log(userMap)


  if(!logout) throw new apiError(400,"so,ething went wrong")
  res.json(new apiResponse(200,"logout succefully"))
})






export {registerUser,loginUser,logout}