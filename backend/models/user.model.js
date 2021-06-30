const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Must enter your name.'],
        trim:true,
        maxLength:[30,'Name cannot exceed 30 characters.']
    },
    email:{
        type:String,
        required:[true,'Must enter your email.'],
        unique:true,
        validate:[validator.isEmail,'Please enter valid email address.']
    },
    password:{
        type:String,
        required:[true,'Must enter a password'],
        minLength:[6,'Password must exceed 6 characters'],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

// encrypting password before posting.

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password,10);
});

// return json web token

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
};

userSchema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetPasswordToken = function () {

    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 30*60*1000;

    return resetToken
};

module.exports = mongoose.model('User',userSchema)