const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
})

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Must input a product name.'],
        trim:true,
        maxLength:[100,'Product name must be less than 100 characters.']
    },
    price:{
        type:Number,
        required:[true,'Must input a product price.'],
        min:[0,'Product price must be more than 0'],
        default:0.0
    },
    description:{
        type:String,
        required:[true,'Must input a product description.']
    },
    ratings:{
        type:Number,
        default:0,
        min:[0,'please use a value greater than 0'],
        max:[5,'please use a value less than 5']
    },
    images:[{
        public_id:{
            type:String,
            required:[true,'Must input a public id for the image.']
        },
        url:{
            type:String,
            required:[true,'Must have a url.']
        }

    }],
    category:{
        type:String,
        required:[true,'Please enter a category for this product.'],
        enum:{
            values:[
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message:'Please select eligible category for product.'
        }
    },
    seller:{
        type:String,
        require:[true,'please enter product seller.']
    },
    stock:{
        type:Number,
        required:[true,'please enter product stock.'],
        max:[9999,'stock must be less than 9999'],
        min:[0,'stock must be at least 0'],
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews: [reviewSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('Product',productSchema)