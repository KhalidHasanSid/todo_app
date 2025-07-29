import asyncHandler from "../utils/asyncHandler.js";
import Note from "../models/todo.model.js";
import { apiError } from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import mongoose,{Types} from "mongoose";
import Share from "../models/share.model.js";
import { shareNote } from "./share.controller.js";


const newTodo =asyncHandler(async(req, res, next)=>{
    console.log("!!",req.user._id)
    console.log("?????????????????????",req.body)
    const {title,description,tag} =req.body 

    if(!title||!description) throw new apiError(400,"something missing")

         let  userNote =await Note.findOne({user:req.user._id})

    

    if(!userNote){
      const  newNote =await Note.create({
    user:req.user._id,
    Notes:[
       { title:title,
         date: new Date(),
        description: description,
          tag: tag? tag :"other"
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
        description: description,
         tag: tag? tag :"other"
    })}
   userNote= await userNote.save()

   

    


    res.json(new apiResponse(200,userNote,"new Note Created "))

})


const getTodo = asyncHandler(async (req, res, next) => {
 

  const result = await Note.findOne({
    user: req.user._id
  }).select("-Notes.viewHistory");

  if (!result || !result.Notes || result.Notes.length === 0) {
    return res.json(new apiResponse(200, [], "no notes found"));
  }

  
  const filteredNotes = result.Notes.filter(note => note.isdeleted === false);

  if (filteredNotes.length === 0) {
    return res.json(new apiResponse(200, [], "no notes found"));
  }

  

  res.json(new apiResponse(200, filteredNotes, "successful"));
});






    


const deleteTodo= asyncHandler(async (req,res,err)=>{

   

     const id= req.params.id
     console.log(typeof(id))

     if(!id) throw new apiError(400,"id is missing")



      const existnote = await Note.findOne({
  user: req.user.id,                    
  "Notes._id": id               
});

    
    if(!existnote)
      throw new apiError(401,"unauthorized acces ")

    const i = existnote.Notes.findIndex(n => n._id.equals(id))
    
  if(i==-1 ) throw new apiError(400, "The user who created this note has deleted it ")

    existnote.Notes[i].isdeleted =true

    await  existnote.save()







        if(!result)
            { throw new apiError(500,"unauthorized access")}

         const  ifpresent = await Share.findOne({shareNote: id})

         if(ifpresent) { const  deletefromShare = await Share.deleteMany({shareNote: id})}

      

       

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

  


  
const i = existnote.Notes.findIndex(n => n._id.equals(id))
 


  if(i==-1 ) throw new apiError(400, "The user who created this note has deleted it ")
   

    
   existnote.Notes[i].viewHistory.push({ prevtitle:existnote.Notes[i].title,
    prevdescription:existnote.Notes[i].description,
    prevstatus:existnote.Notes[i].status,
    prevdate:existnote.Notes[i].date,
    updatedby:req.user.username,
    prevVersion:existnote.Notes[i].version})

   if(title) existnote.Notes[i].title=title
    if(description) existnote.Notes[i].description=description
    if(status) existnote.Notes[i].status=status
    existnote.Notes[i].version= existnote.Notes[i].version+1

    
    
      

  
  

   await  existnote.save()
    


    
   
 

    res.json(new apiResponse(200,existnote[i],"updated succefully"))

})



const countNotes = asyncHandler(async (req, res) => {
 

 const result = await Note.findOne({
      user: req.user._id
    }).select("-Notes.viewHistory");
  
    if (!result || !result.Notes || result.Notes.length === 0) {
      return res.json(new apiResponse(200, [], "no notes found"));
    }
  
    
    const notecount = result.Notes.filter(note => note.isdeleted === false);
  

  const sharednotes = await Share.countDocuments({  sharefrom_id: req.user._id },);

  
  const notes= notecount.length

  res.json(new apiResponse(200, { notes, sharednotes }, "successful"));
});














 const getfilteredTodo =asyncHandler(async(req,res)=>{
  console.log("==================");

  const result = await Note.findOne({
    user: req.user._id
  }).select("-Notes.viewHistory");

  if (!result || !result.Notes || result.Notes.length === 0) {
    return res.json(new apiResponse(200, [], "no notes found"));
  }

  
  const filteredNotes = result.Notes.filter(note => note.isdeleted === false &&note.tag===req.params.id  );

  if (filteredNotes.length === 0) {
    return res.json(new apiResponse(200, [], "no notes found"));
  }

  console.log(filteredNotes);

  res.json(new apiResponse(200, filteredNotes, "successful"));
   

 })






export {newTodo ,getTodo, deleteTodo, updateTodo, countNotes,getfilteredTodo}