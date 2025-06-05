import mongoose from 'mongoose'

const DBconnection = async ()=>{
    try{
        const connection =await mongoose.connect(`${process.env.MONGO_URI}/todo`)
        if(connection)
        console.log("connection mounted")}
    catch(e) {
        console.log("unable to connect to db",e)
    }
}

export  {DBconnection}