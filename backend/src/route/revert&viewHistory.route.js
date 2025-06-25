import { Router } from "express";
import { viewHistory, revert} from "../controller/revert&viewHistory.controller.js";
import auth from "../middleware/authorization.js"

const revert_viewhistory= Router()

revert_viewhistory.route("/viewHistory/:id").get(auth,viewHistory)
revert_viewhistory.route("/revert/:id").patch(auth,revert)


export  default revert_viewhistory