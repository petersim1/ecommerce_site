const mongoose = require('mongoose');
const User = require('../models/user.model');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

require('dotenv').config({ path: '../config/config.env' })


module.exports.registerUser = (req,res,next) => {

    const {name,email,password} = req.body;
    const paramsPass = {
        folder:"avatars",
        width:150,
        crop:"scale"
    }

    cloudinary.v2.uploader.upload(req.body.avatar,paramsPass,(err,result) => {
        if (err) return next(new ErrorHandler(err.message, err.http_code));
        const params = {
            name,
            email,
            password,
            avatar:{
                public_id:result.public_id,
                url:result.secure_url
            }
        }
        User.create(params,async (err2,user) => {
            if (err2) return next(new ErrorHandler(err2.message, 500));
            if (user) {
                const token = await user.getJwtToken();
                sendToken(user,200,res);
            } else {
                next(new ErrorHandler('User not added', 404));
            }
        });
    })
};

module.exports.loginUser = (req,res,next) => {

    const {email,password} = req.body;


    User.findOne({email}).select('+password').exec(async (err,user) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (user) {
            const isMatchedPassword = await user.comparePassword(password);
            if (isMatchedPassword) {
                sendToken(user,200,res);
            } else {
                next(new ErrorHandler('Invalid email or password.', 401));
            }
        } else {
            next(new ErrorHandler('User not found.', 401));
        }
    });
};

module.exports.logoutUser = (req,res,next) => {

    res.cookie('token',null, {
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:'Logged Out.'
    })
};

module.exports.getUserProfile = (req,res,next) => {

    User.findById(req.user.id, (err,user) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        res.status(200).json({
            success:true,
            user
        })
    })
}

module.exports.updatePassword = (req,res,next) => {

    User.findById(req.user.id).select('+password').exec( async (err,user) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        const isMatchedPassword = await user.comparePassword(req.body.oldPassword);
        if (isMatchedPassword) {
            user.password = req.body.newPassword;
            await user.save();
            sendToken(user,200,res);
        } else {
            next(new ErrorHandler('Old Password in incorrect.', 401));
        }
    })
}

module.exports.updateProfile = (req,res,next) => {

    const paramsPass = {
        folder:"avatars",
        width:150,
        crop:"scale"
    }

    User.findById(req.user.id, async (err,user) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (user) {
            user.name = req.body.name
            user.email = req.body.email

            if (req.body.avatar) {
                const image_id = user.avatar.public_id
                await cloudinary.v2.uploader.destroy(image_id);
                cloudinary.v2.uploader.upload(req.body.avatar,paramsPass,(error,result) => {
                    if (err) return next(new ErrorHandler(error.message, error.http_code));
                    if (result) {
                        user.avatar = {
                            public_id:result.public_id,
                            url:result.secure_url
                        }
                    }
                })
            }
            await user.save()

            res.status(200).json({
                success:true
            })
        }
        else {
            return next(new ErrorHandler('User not found!', 500));
        }
    })

};

module.exports.forgotPassword = (req,res,next) => {

    User.findOne({email:req.body.email} , async (err,user) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (user) {
            const resetToken = await user.getResetPasswordToken();
            await user.save({validateBeforeSave:false});

            const resetURL = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`
            const message = `Password reset token is as follows:\n\n${resetURL}\n\nIf you did not request this, you can ignore it.`
            try {
                await sendEmail({
                    email:user.email,
                    subject:'Recovery password',
                    message
                })
                res.status(200).json({
                    success:true,
                    message:`Email sent to ${user.email}`
                })
                
            } catch (error) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save({validateBeforeSave:false});
                next(new ErrorHandler(error.message, 500));
            }

        } else {
            next(new ErrorHandler('User not found.', 401));
        }
    })

}

module.exports.resetPassword = (req,res,next) => {

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    }, async (err,user) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (user) {
            if (req.body.password != req.body.confirmPassword) {
                return next(new ErrorHandler('Passwords do not match', 400));
            }
            user.password = req.body.password
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();
            sendToken(user,200,res);
        } else {
            next(new ErrorHandler('Invalid token or has expired.', 400));
        }
    });
}

module.exports.getAllUsers = (req,res,next) => {
    
    User.find({}, (err,users) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        res.status(200).json({
            success:true,
            users
        })

    })
}

module.exports.getUserInfo = (req,res,next) => {
    
    User.findById(req.params.id, (err,user) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (user) {
            res.status(200).json({
                success:true,
                user
            })
        } else {
            next(new ErrorHandler(`User not found with id ${req.params.id}`, 400));
        }

    })
}

module.exports.updateUserInfo = (req,res,next) => {
    
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const paramsPass = {
        new:true,
        runValidators:true,
        useFindAndModify:false
    }

    User.findByIdAndUpdate(req.params.id, newUserData, paramsPass, (err,user) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        res.status(200).json({
            success:true
        })
    })
}

module.exports.deleteUserInfo = (req,res,next) => {
    
    User.findByIdAndDelete(req.params.id, (err,user) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (user) {
            res.status(200).json({
                success:true,
                message:'user successfully deleted.'
            })
        } else {
            next(new ErrorHandler(`User not found with id ${req.params.id}`, 400));
        }

    })
}