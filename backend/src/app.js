import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

const App= express()
App.use(cors({ origin: 'http://localhost:5173', 
      credentials: true 
    }))

App.use(bodyParser.json())

App.use(express.urlencoded({limit:'16kb',extended:true}))

App.use(cookieParser())

import userRouter from './route/user.route.js'
import todoRouter from './route/todo.router.js'
import shareRouter from './route/share.route.js'
import revert_viewhistory from './route/revert&viewHistory.route.js'
App.use('/api/v1/user',userRouter)
App.use('/api/v1/todo',todoRouter)
App.use('/api/v1/shareTo',shareRouter)
App.use('/api/v1/revertHistory',revert_viewhistory)


export default App 