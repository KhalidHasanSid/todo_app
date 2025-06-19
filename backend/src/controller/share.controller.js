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

     let  data = await Share.find({shareWithUser:req.user._id},{isEditable:1,shareNote:1}).sort({createdAt:1})
     
     for(let i=0;i<data.length;i++){
         const note = await Note.findOne(
  { "Notes._id": data[i].shareNote },
  { "Notes.$": 1, _id: 0 }
);
    data[i]= data[i].toObject()
     data[i].title=note.Notes[0].title
     data[i].description=note.Notes[0].description
     data[i].status=note.Notes[0].status
          
     }
     res.json(new apiResponse(200,data,"successfully get the data"))



  })

  const updateSharedPost =asyncHandler(async(req,res)=>{
    const {title, description,status}=req.body
    const noteid= new Types.ObjectId(req.params.id)

    const currentNote = await Note.findOne(
  { "Notes._id": noteid },
  { "Notes.$": 1, _id: 0 }
);

  if(!currentNote) throw new apiError(400, "The user who created this note has deleted it ")

    console.log(currentNote)

    const  editable= await Share.findOne({shareNote:noteid,isEditable:true,shareWithUser:req.user.id})

    if(!editable)throw new apiError(400,"you cant update ")


const updateFields = {};

if (title) updateFields["Notes.$.title"] = title;
if (description) updateFields["Notes.$.description"] = description;
if (status) updateFields["Notes.$.status"] = status;







console.log(updateFields)





const result = await Note.findOneAndUpdate(
  { "Notes._id": noteid },
  {
    $set: updateFields,
    $push: {
      "Notes.$.viewHistory": {
        prevtitle: currentNote.title,
        prevdescription: currentNote.description,
        prevstatus: currentNote.status,
        updatedby: req.user.username
      }
    }
  },
  { new: true, runValidators: true }
);





  })



export {getUsers, shareNote, getSharedNotes}