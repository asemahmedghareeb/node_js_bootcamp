import mongoose from "mongoose";
import validator from 'validator';
import userRoles from "../utils/roles.js";
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,'Please provide a valid email'] 
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:[userRoles.USER,userRoles.ADMIN,userRoles.MANAGER],
        required:true,
        default:userRoles.USER
    },
    avatar:{
        type:String,
        default:'uploads/test.png',
        required:false
    }
})

const userModel = mongoose.model('User',userSchema);
export default userModel;