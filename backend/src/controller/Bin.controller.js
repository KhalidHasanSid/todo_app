import asyncHandler from "../utils/asyncHandler.js"
import apiResponse from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js" 
import Note from "../models/todo.model.js"

const getbinTodo =asyncHandler(async (req,res,next)=>{

    console.log("iohvwiouhdwilusdbdwpiewuvbnewbi;ewbdnadw ;ibanb")


 console.log("==================");
 
   const result = await Note.findOne({
     user: req.user._id
   }).select("-Notes.viewHistory");
 
   if (!result || !result.Notes || result.Notes.length === 0) {
     return res.json(new apiResponse(200, [], "no notes found"));
   }
 
   
   const filteredNotes = result.Notes.filter(note => note.isdeleted === true);
 
   if (filteredNotes.length === 0) {
     return res.json(new apiResponse(200, [], "no notes found"));
   }
 
   console.log(filteredNotes);
 
   res.json(new apiResponse(200, filteredNotes, "successful"));
 });


 const deleteBintodo =asyncHandler(async (req,res,next)=>{

         const id= req.params.id
     console.log(typeof(id))

     if(!id) throw new apiError(400,"id is missing")



     const result = await Note.findOneAndUpdate( { user: req.user._id },  { $pull: { Notes: { _id: id } } })

        if(!result)
            { throw new apiError(500,"unauthorized access")}

        
      

       

        res.json(new apiResponse(200,result, "successfullly deleted "))

 })  


     const restoreTodo= asyncHandler(async (req,res,err)=>{

        console.log("kia krna chahiye................................................")

     
        
     
          const id= req.params.id
          console.log(typeof(id))
     
          if(!id) throw new apiError(400,"id is missing")
     
     
     
           const existnote = await Note.findOne({
       user: req.user.id,                    
       "Notes._id": id               
     });
     console.log(existnote,"binding")
         
         if(!existnote)
           throw new apiError(401,"unauthorized acces ")
     
         const i = existnote.Notes.findIndex(n => n._id.equals(id))
         
       if(i==-1 ) throw new apiError(400, "The user who created this note has deleted it ")
     
         existnote.Notes[i].isdeleted =false
     
         await  existnote.save()   

         res.json(apiResponse(200,"succuflly changesd"))
        
        })


     export{ getbinTodo,deleteBintodo,restoreTodo}