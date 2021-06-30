const Product = require('../models/product.model');
const User = require('../models/user.model')
const connectDatabase = require('../config/database');

const productData = require('../data/products');
const userData = require('../data/users');

connectDatabase();

const seedProducts = async () => {
    try {

        await Product.deleteMany();
        console.log('Products are deleted');

        await Product.insertMany(productData)
        console.log('All Products are added.')

        await User.deleteMany();
        console.log('Users are deleted');

        await User.create(userData)
        console.log('All Users are added.')

        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedProducts()