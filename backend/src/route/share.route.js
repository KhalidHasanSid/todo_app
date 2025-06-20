import { Router } from "express";
import { getUsers, shareNote,getSharedNotes,updateSharedNote } from "../controller/share.controller.js";
import auth from "../middleware/authorization.js";


const shareRouter =Router()


shareRouter.route("/getUsers").get(auth,getUsers)
shareRouter.route("/shareNote").post(auth,shareNote)
shareRouter.route("/getsharedNotes").get(auth,getSharedNotes)
shareRouter.route("/updatesharedNote/:id").patch(auth,updateSharedNote)


export default shareRouter