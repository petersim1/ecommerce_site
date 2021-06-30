const mongoose = require('mongoose');
const Product = require('../models/product.model');
const ErrorHandler = require('../utils/errorHandler');
const APIFeatures = require('../utils/apiFeatures');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const cloudinary = require('cloudinary');

module.exports.newProduct = catchAsyncErrors(async (req,res,next) => {

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];
    const paramsPass = {folder:'products'}

    for (let i = 0; i < images.length; i++) {
        await cloudinary.v2.uploader.upload(images[i], paramsPass,(err,result) => {
            if (err) return next(new ErrorHandler(err.message, 500));
            if (result) {
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })
            } else {
                next(new ErrorHandler('image could not be uploaded', 404));
            }
        });
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;

    //automatically does validation.
    Product.create(req.body,(err,product) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (product) {
            res.status(200).json({
                success:true,
                message:'created new product',
                product
            })
        } else {
            next(new ErrorHandler('Product not added', 404));
        }
    });
});

exports.getAdminProducts = (req, res, next) => {

    Product.find({},(err,products) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (products) {
            res.status(200).json({
                success:true,
                products
            })
        } else {
            next(new ErrorHandler('No products found', 404));
        }
    });
}


module.exports.getProducts = async (req,res,next) => {

    let resPerPage = 4;

    // Rather than chain executing queries, I just build the query object to use.
    const apiFeatures = new APIFeatures(req.query,resPerPage)
        .search()
        .filter()
        .pagination();

    const totDocs = await Product.countDocuments({});

    Product.find(apiFeatures.findQuery).limit(resPerPage).skip(apiFeatures.skip).exec((err,products) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (products) {
            setTimeout(() => {
                res.status(200).json({
                    success:true,
                    resPerPage,
                    totDocs,
                    count:products.length,
                    products
                })
            },2000)
        } else {
            res.status(404).json({
                success:false,
                message:'No products.'
            })
        }
    });
};

module.exports.getSingleProduct = (req,res,next) => {

    Product.findById(req.params.id,(err,product) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (product) {
            res.status(200).json({
                success:true,
                product
            })
        } else {
            next(new ErrorHandler('Product Not Found', 404));
        }
    });
};

module.exports.updateProduct = catchAsyncErrors(async (req,res,next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            await cloudinary.v2.uploader.upload(images[i], {folder:'products'},(err,result) => {
                if (err) return next(new ErrorHandler(err.message, 500));
                if (result) {
                    imagesLinks.push({
                        public_id: result.public_id,
                        url: result.secure_url
                    })
                } else {
                    next(new ErrorHandler('image could not be uploaded', 404));
                }
            });
        }

        req.body.images = imagesLinks
    }

    const paramsPass = {
        new:true,
        runValidators:true,
        useFindAndModify:false
    }

    Product.findByIdAndUpdate(req.params.id, req.body, paramsPass,(err,product) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (product) {
            res.status(200).json({
                success:true,
                product
            })
        } else {
            res.status(404).json({
                success:false,
                message:'Product not found!'
            })
        }
    });
});

module.exports.deleteProduct = (req,res,next) => {

    Product.findByIdAndDelete(req.params.id, (err,product) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (product) {
            res.status(200).json({
                success:true,
                message:'successfully deleted document',
                product
            })
        } else {
            res.status(404).json({
                success:false,
                message:'Product not found!'
            })
        }
    });

}


module.exports.newProductReview = async (req,res,next) => {

    const {rating,comment,productID} = req.body;

    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }

    const product = await Product.findById(productID);

    const isReviewed = await product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        await product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = await product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })
};

module.exports.getProductReviews = (req,res,next) => {

    Product.findById(req.query.id,(err,product) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (product) {
            res.status(200).json({
                success:true,
                reviews: product.reviews
            })
        } else {
            next(new ErrorHandler('Product not found.', 401));
        }
    })
}

module.exports.deleteProductReview = (req,res,next) => {

    Product.findById(req.query.productID,async (err,product) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (product) {
            const reviews = await product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
            const numOfReviews = reviews.length;
            const ratings = await reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

            product.reviews = reviews
            product.numOfReviews = numOfReviews
            product.ratings = ratings
            await product.save({ validateBeforeSave: false });

            res.status(200).json({
                success:true,
                message:'review deleted.'
            })
        } else {
            next(new ErrorHandler('Product not found.', 401));
        }
    })
}