import { Router } from "express";
import auth from "../middleware/authorization.js";
import { getbinTodo ,deleteBintodo,restoreTodo} from "../controller/Bin.controller.js";

const binRouter =Router()


 binRouter.route('/delete/:id').delete( auth,deleteBintodo)
  binRouter.route('/restore/:id').patch( auth,restoreTodo)
binRouter.route('/getbintodo').get( auth,getbinTodo)


export default binRouter