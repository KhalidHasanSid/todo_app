import Note from "../models/todo.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Types } from "mongoose";
import apiResponse from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";


const viewHistory = asyncHandler(async(req,res)=>{
    console.log("hiew history controlle")

    const noteId = new Types.ObjectId(req.params.id)
    

    const note =await Note.findOne({user:req.user._id,"Notes._id":noteId}).sort({"Notes.VIEWHistory":-1})
   // console.log(note)
    const i = note.Notes.findIndex((eachValue)=>{ return eachValue._id.equals(noteId)})
    console.log(i)
     res.json(new apiResponse(200,note.Notes[i],"successfull"))






})
 const revert=asyncHandler(async(req,res)=>{
    const noteId=  new Types.ObjectId(req.params.id)

     const note =await Note.findOne({user:req.user._id,"Notes._id":noteId})

     if(!note) throw new apiError(401,"this note doesnot exist")

      const i = note.Notes.findIndex((eachValue)=>{ return eachValue._id.equals(noteId)})

      const previous_Version =note.Notes[i].viewHistory.length-1
      console.log(note.Notes[i].viewHistory[previous_Version])


     

      note.Notes[i].title=note.Notes[i].viewHistory[previous_Version].prevtitle
       note.Notes[i].description=note.Notes[i].viewHistory[previous_Version]. prevdescription
        note.Notes[i].status=note.Notes[i].viewHistory[previous_Version]. prevstatus
         note.Notes[i].version=note.Notes[i].viewHistory[previous_Version].prevVersion
         note.Notes[i].viewHistory.pop()

      await   note.save()

    

      res.json(new  apiResponse(200,note.Notes[i],"note reverted "))

      








 })

export{viewHistory, revert}