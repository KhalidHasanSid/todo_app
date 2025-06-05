import App from "./app.js";
import dotenv from 'dotenv'
import {DBconnection} from "./db/db.js";

dotenv.config({path:'./.env'})


DBconnection()
.then(()=>{
    App.listen(  process.env.PORT||6700,()=>{
         console.log(`port is listening at ${process.env.PORT}`)
    })
 })
 .catch((err)=>{
    console.log("error occur while connecting to",err)
 })