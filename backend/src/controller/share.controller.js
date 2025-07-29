import User from "../models/user.js"
import asyncHandler from "../utils/asyncHandler.js"
import apiResponse from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"
import Share from "../models/share.model.js"
import mongoose,{Types} from "mongoose";
import Note from "../models/todo.model.js"


const getUsers= asyncHandler(async(req,res)=>{
      const users=await User.find({},{username:1})
      if(!users)
        throw new apiError(500,"spmething went wrong ")

      console.log('users',users)
      res.json(new apiResponse(200,users))
})

   const shareNote =asyncHandler(async(req,res)=>{
        const  sharedwithUsers =req.body
        console.log(req.user.username)

        if(!sharedwithUsers) throw new apiError(400,"nothing to share ")

           const result = await  Promise.all(sharedwithUsers.map(((user)=>{

          

            Share.create({
                 shareNote:new Types.ObjectId(user.shareNote),
                  shareWithUser:new Types.ObjectId(user.shareWithUser),
                   isEditable: user.isEditable,
                    sharefrom_id:req.user._id,
                   sharefrom_name: req.user.username


            })


           })))


            if(!result)throw new apiError(400,"something went wrong")

                res.json(new apiResponse(200,result))

            
                
            });
   


  const getSharedNotes =asyncHandler(async(req,res)=>{

     let  data = await Share.find({shareWithUser:req.user._id},{isEditable:1,shareNote:1,
sharefrom_name:1}).sort({createdAt:1})
    console.log("DATA=",data)
     
     for(let i=0;i<data.length;i++){
         let note = await Note.findOne(
  { "Notes._id": data[i].shareNote },
  { "Notes.$": 1, _id: 0 }

 
); 
      if(!note)throw new apiError(400, "not able to find")  
    console.log(note,"---------",i)
    data[i]= data[i].toObject()
  //  console.log(note.Notes[i].title)
     data[i].title=note.Notes[0].title
     data[i].description=note.Notes[0].description
     data[i].status=note.Notes[0].status
     
          
     }
    // console.log("-----------------------------")
     //console.log("new data",data)
     res.json(new apiResponse(200,data,"successfully get the data"))



  })

  const updateSharedNote =asyncHandler(async(req,res)=>{
   console.log("here i am in update by other shared user")
    const {title, description,status}=req.body
    console.log(title ,description,status)
    const noteid= new Types.ObjectId(req.params.id)
    console.log(noteid)

    const existnote = await Note.findOne(
  { "Notes._id": noteid }
 
);

console.log("check weather the notte exist",existnote)

  if(!existnote) throw new apiError(400, "The user who created this note has deleted it ")

//    console.log(currentNote)

    const  editable= await Share.findOne({shareNote:noteid,isEditable:true,shareWithUser:req.user.id})

    if(!editable)throw new apiError(400,"you cant update ")


        if(!existnote)
      throw new apiError(401,"unauthorized acces ")

  if(!title && !description&& !status) throw new apiError(400,"bad request")

  


  
const i = existnote.Notes.findIndex(n => n._id.equals(noteid))
 

console.log("chk",i)

  if(i<0 ) throw new apiError(400, "The user who created this note has deleted it ")

    
   existnote.Notes[i].viewHistory.push({ prevtitle:existnote.Notes[i].title,
    prevdescription:existnote.Notes[i].description,
    prevstatus:existnote.Notes[i].status,
     prevdate:existnote.Notes[i].date,
    updatedby:req.user.username,
    prevVersion:existnote.Notes[i].version})

   if(title) existnote.Notes[i].title=title
    if(description) existnote.Notes[i].description=description
    if(status) existnote.Notes[i].status=status
     existnote.Notes[i].date=new Date()
    existnote.Notes[i].version= existnote.Notes[i].version+1


    
    
      

  
  

     await existnote.save()


    res.json(new apiResponse(200,existnote,"successful update by other user "))






















  })



export {getUsers, shareNote, getSharedNotes, updateSharedNote}