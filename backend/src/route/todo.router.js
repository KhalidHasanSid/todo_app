import { Router } from "express";

import { newTodo ,getTodo, deleteTodo, updateTodo} from "../controller/todo.controller.js";
import auth from "../middleware/authorization.js";

const todoRouter =Router()

todoRouter.route('/newtodo').post( auth,newTodo)
todoRouter.route('/gettodo').get( auth,getTodo)
todoRouter.route('/deletetodo/:id').delete( auth,deleteTodo)
todoRouter.route('/updatetodo/:id').patch(auth,updateTodo)

export default todoRouter
