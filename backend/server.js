const express = require('express');
const app = express();
const connectDB = require('./config/database');
const errorMiddleware = require('./middlewares/errors');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload')
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(fileUpload());


process.on('uncaughtException', err => {
  console.log(`ERROR ${err.stack}`)
  console.log('Shutting down server due to uncaught exception')
  process.exit(1);
})

// Setting up config file.
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: __dirname+'/config/config.env' })

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Connecting DB
connectDB();

const products = require(__dirname + '/routes/product')
const users = require(__dirname+'/routes/user')
const orders = require(__dirname+'/routes/order')
const payments = require(__dirname+'/routes/payments')

// Route
app.use('/api/v1',products);
app.use('/api/v1',users);
app.use('/api/v1',orders);
app.use('/api/v1',payments);


if (process.env.NODE_ENV === 'PRODUCTION') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
  })
}


// Middleware to handle errors.
app.use(errorMiddleware) ;


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV}`);
});