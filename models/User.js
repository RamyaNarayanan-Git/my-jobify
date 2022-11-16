import mongoose from "mongoose";
import validator from 'validator';
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Please provide name'],
        minLength: 3,
        maxLength: 20,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique:true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a vaild email'
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: 5,
        select: false,
    },
    lastName: {
        type: String, 
        trim: true,
        maxLength: 20,
        default: 'lastName'
    },
    location: {
        type: String, 
        maxLength: 20,
        trim: true,
        default:'my city'
    },
})

UserSchema.pre('save', async function(){
    if(!this.isModified('password')) return
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password,salt)
    // console.log(this.password)
})

UserSchema.methods.createJWT = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME})
    // console.log(this)
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcryptjs.compare(candidatePassword, this.password)
    return isMatch
}

export default mongoose.model('User', UserSchema)