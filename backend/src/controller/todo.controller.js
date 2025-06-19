import asyncHandler from "../utils/asyncHandler.js";
import Note from "../models/todo.model.js";
import { apiError } from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import mongoose,{Types} from "mongoose";

const newTodo =asyncHandler(async(req, res, next)=>{
    console.log("!!",req.user._id)
    const {title,description} =req.body 

    if(!title||!description) throw new apiError(400,"something missing")

         let  userNote =await Note.findOne({user:req.user._id})

    

    if(!userNote){
      const  newNote =await Note.create({
    user:req.user._id,
    Notes:[
       { title:title,
         date: new Date(),
        description: description
    }

    ]
    })
     res.json(new apiResponse(200,newNote
      ,"new Note Created "))

}
    else{

    await  userNote.Notes.push(
    {  title:title,
         date: new Date(),
        description: description
    })}
   userNote= await userNote.save()

   

    


    res.json(new apiResponse(200,userNote,"new Note Created "))

})


const getTodo =asyncHandler(async (req,res,next)=>{


  console.log("==================")

    const result =await Note.findOne({user:req.user._id}).select(
        "-Notes.viewHistory"
    )
    if(!result|| result.length===0)
         res.json(new apiResponse(200,[],"no notes found"))


     res.json(new apiResponse(200,result.Notes,"successfull"))






    
})

const deleteTodo= asyncHandler(async (req,res,err)=>{

   

     const id= req.params.id
     console.log(typeof(id))

     if(!id) throw new apiError(400,"id is missing")

//       const existnote = await Note.findOne({
//   user: req.user.id,                    
//   "Notes._id": id               
// });
    
//     if(!existnote)
//       throw new apiError(401,"unauthorized acces ")

     const result = await Note.findOneAndUpdate( { user: req.user._id },  { $pull: { Notes: { _id: id } } })

        if(!result)
            { throw new apiError(500,"unauthorized access")}

        res.json(new apiResponse(200,result, "successfullly deleted "))

    



  

  

    




})


const updateTodo= asyncHandler(async(req,res)=>{

  let id= req.params.id;
   id= new Types.ObjectId(id);

  console.log(typeof(id),req.user._id,"chk=",id)
  const {title, description,status} = req.body; 

   if(!id) throw new apiError(400,"id is missing")

      const existnote = await Note.findOne({
  user: req.user.id,                    
  "Notes._id": id               
});
    
    if(!existnote)
      throw new apiError(401,"unauthorized acces ")

  if(!title && !description&& !status) throw new apiError(400,"bad request")

  const updateFields = {};

if (title) updateFields["Notes.$.title"] = title;
if (description) updateFields["Notes.$.description"] = description;
if (status) updateFields["Notes.$.status"] = status;
console.log(updateFields)


const currentNote = await Note.findOne(
  { "Notes._id": id },
  { "Notes.$": 1, _id: 0 }
);

  if(!currentNote) throw new apiError(400, "The user who created this note has deleted it ")

    console.log(currentNote)


const result = await Note.updateOne(
  { "Notes._id": id},
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

if(!result)throw new apiError(400,"something went wrong")

    res.json(new apiResponse(200,result,"updated succefully"))

})








export {newTodo ,getTodo, deleteTodo, updateTodo}