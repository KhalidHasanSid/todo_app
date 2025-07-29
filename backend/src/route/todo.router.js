import { Router } from "express";

import { newTodo ,getTodo, deleteTodo, updateTodo, countNotes, getfilteredTodo} from "../controller/todo.controller.js";
import auth from "../middleware/authorization.js";

const todoRouter =Router()

todoRouter.route('/newtodo').post( auth,newTodo)
todoRouter.route('/gettodo').get( auth,getTodo)
todoRouter.route('/getfilteredtodo/:id').get( auth,getfilteredTodo)
todoRouter.route('/deletetodo/:id').delete( auth,deleteTodo)
todoRouter.route('/updatetodo/:id').patch(auth,updateTodo)
todoRouter.route('/count').get(auth,countNotes)

export default todoRouter
