import mongoose, { Schema } from "mongoose";
import User from "./user.js";
import Note from "./todo.model.js";

const shareSchema = mongoose.Schema({

    shareNote: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    },

    shareWithUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },



    isEditable: {
        type: Boolean,

    },

    sharefrom_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    sharefrom_name: {
        type: String,
    }




}, { timeStamps: true })

const Share = mongoose.model("Share", shareSchema)

export default Share