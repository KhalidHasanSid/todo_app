import { Router } from "express";
import { getUsers, shareNote,getSharedNotes } from "../controller/share.controller.js";
import auth from "../middleware/authorization.js";


const shareRouter =Router()


shareRouter.route("/getUsers").get(auth,getUsers)
shareRouter.route("/shareNote").post(auth,shareNote)
shareRouter.route("/getsharedNotes").post(auth,getSharedNotes)


export default shareRouter