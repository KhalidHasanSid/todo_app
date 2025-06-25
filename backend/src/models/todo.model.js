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
                 type:String,
                 lowercase:true,
                default:"in progress",
                type:String,
                enum:["in progress",'done'],


                
               },

                version:{
                  type:Number,
                  default:1
                },

               viewHistory:[
                 {
               prevtitle: {type:String,
                trim: true,
                
                     
               },
               prevdescription: {type:String,
                trim: true,
              
                     
               },
               prevdate:{
                type:Date,
               
               },
               prevstatus:{
                 type:String,
                 lowercase:true,
                enum:["in progress",'done'],
                
               },
                updatedby:
                 { type:String},

                  prevVersion:{type:Number}
                
                }

               ]

               

           }
     ]
},{timestamps:true})


const Note =mongoose.model("Note",notesSchema)

export default Note