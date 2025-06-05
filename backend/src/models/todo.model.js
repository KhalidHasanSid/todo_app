import mongoose ,{Schema}from "mongoose";
import User from "./user.js";


const notesSchema = mongoose.Schema({

    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
     },

     Notes: [
           {
               title: {type:String,
                trim: true,
                required:true
                     
               },
               description: {type:String,
                trim: true,
                required:true
                     
               },
               date:{
                type:Date,
                required:true
               },
               status:{
                default:"In progress",
                type:String,
                required:true
               }

               

           }
     ]
},{timestamps:true})


const Note =mongoose.model("Note",notesSchema)

export default Note