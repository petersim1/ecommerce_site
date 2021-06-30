const ErrorHandler = require('../utils/errorHandler');


module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500 ;

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success:false,
            err:err,
            errMessage:err.message,
            stack:err.stack
        })
    } else {
        let error = {...err};
        error.message = err.message;

        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }
        
        res.status(error.statusCode).json({
            success:false,
            message:error.message || 'Internal Server Error.'
        })
    }
}