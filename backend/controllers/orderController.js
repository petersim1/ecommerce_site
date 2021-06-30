const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const ErrorHandler = require('../utils/errorHandler');

module.exports.addOrder = (req,res,next) => {

    const params = {...req.body};
    params.user = req.user.id;
    params.paidAt = Date.now();

    Order.create(params,(err,order) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (order) {
            res.status(200).json({
                success:true,
                order
            })
        } else {
            next(new ErrorHandler('Product not added', 404));
        }
    });
};

module.exports.getSingleOrder = (req,res,next) => {

    Order.findById(req.params.id).populate('user','name email').exec((err,order) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (order) {
            res.status(200).json({
                success:true,
                order
            })
        } else {
            next(new ErrorHandler('No order with this id.', 404));
        }
    });
};

module.exports.deleteSingleOrder = (req,res,next) => {

    Order.findById(req.params.id).populate('user','name email').exec( async (err,order) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (order) {
            await order.remove()
            res.status(200).json({
                success:true,
                message:'order removed.'
            })
        } else {
            next(new ErrorHandler('No order with this id.', 404));
        }
    });
};

module.exports.getMyOrder = (req,res,next) => {

    Order.find({user:req.user.id},(err,orders) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (orders) {
            res.status(200).json({
                success:true,
                orders
            })
        } else {
            next(new ErrorHandler('No orders for this user.', 404));
        }
    });
};

module.exports.getOrders = (req,res,next) => {

    Order.find({},async (err,orders) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (orders) {

            let totalAmount = 0;
            orders.forEach(order => {
                totalAmount += order.totalPrice
            })

            res.status(200).json({
                success:true,
                count:orders.length,
                totalAmount:totalAmount,
                orders
            })
        } else {
            next(new ErrorHandler('No orders.', 404));
        }
    });
};

module.exports.updateOrder = (req,res,next) => {

    Order.findById(req.params.id,async (err,order) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (order) {
            if (order.status == 'Delivered') {
                return next(new ErrorHandler('You have already delivered this order.', 500));
            }

            order.orderItems.forEach(async item => {
                await updateStock(item.product,item.quantity)
            })

            order.orderStatus = req.body.status;
            order.deliveredAt = Date.now();

            await order.save()

            res.status(200).json({
                success:true,
            })
        } else {
            next(new ErrorHandler('No orders.', 404));
        }
    });
};

async function updateStock(id,quantity) {
    
    Product.findById(id, async (err,product) => {
        if (err) return next(new ErrorHandler(err.message, 500));
        if (product) {
            product.stock = product.stock - quantity
            await product.save({validateBeforeSave:false})
        }
    })
}