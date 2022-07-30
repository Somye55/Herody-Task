const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first:{
        required:true,
        type:String,
        
    },
    last:{
        required:true,
        type:String,

    },
    dob:{
        type:Date,

    },
    email:{
        required:true,
        type:String,
        unique:true

    },
    password:{
        required:true,
        type:String

    },
    state:{
        type:String,

    },
    gender:{
        type:String,
        enum:['male','female','others']

    },
    emailToken:{
        type:String
    },
    isVerified:{
        type: Boolean,
        default:false
    },
    phoneNumber:{
        required:true,
        type:String
    },
    isChecked:{
        default:false,
        type:Boolean
    }
})
const User = new mongoose.model('User',UserSchema);

module.exports = User
