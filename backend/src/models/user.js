import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const  userSchema = mongoose.Schema({
    username: {
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    email:
    { type:String,
    unique:true,
      required:true,
      trim:true
      
    },


    password:
    { type:String,
      required:true
      
    }





},{timeStamp:true})


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {return next();}
  this.password = await  bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.validatePassword= async function (password) {
  return  await  bcrypt.compare(password, this.password)
}


 const User = mongoose.model('User',userSchema)

 export default User