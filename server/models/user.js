import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Schema, model } from 'mongoose'
import validator from 'validator'

const userSchema = new Schema({
    fullNameEnglish: {
        type: String,
        required: [true, "User must have a full name in English"],
        unique: false,
        minlength: [2, 'Full name cannot be less than 2 characters'],
        maxlength: [30, 'Full name cannot exceed 30 characters']
    },
    fullNameArabic: {
        type: String,
        required: [true, "User must have a full name in Arabic"],
        unique: false,
        minlength: [2, 'Full name cannot be less than 2 characters'],
        maxlength: [30, 'Full name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'User must have an email'],
        unique: false,
        validate: [validator.isEmail, 'Please enter a valid email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
    },
    phone: {
        type: String,
        default: "",
        required: false,
        unique: false,
    },
    secondaryPhone: {
        type: String,
        default: "",
        required: false,
        unique: false,
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [8, 'Password must be atleast 8 characters'],
        select: false
    },
    // role
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin', 'spectator'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    },

}, { timestamps: true })

// Encrypting password om pre

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT_ROUND))
})

userSchema.methods.genJwtoken = function (sessionId) {
    return jwt.sign({ id: this._id, sessionId: sessionId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE
    })
}

userSchema.methods.genRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRE
    })
}

//compare user password

userSchema.methods.comparePasswords = async function (password) {
    return await bcrypt.compare(password, this.password)
}


userSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    },
});


const User = model('User', userSchema)

export default User