const mongoose = require('mongoose');
require('dotenv').config({ path:'backend/config/config.env' })

const connectDB = () => {
    const params = {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
    };
    const link = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.fm2m4.mongodb.net/shopit?retryWrites=true&w=majority`
    mongoose.connect(link, params).then(con => {
        console.log(`mongoDB connected with HOST ${con.connection.host}`)
    }).catch(() => {
        console.log('Error connecting to mongoDB!');
        mongoose.connection.close(() => {
            console.log('Closing connection.');
            process.exit(0);
        });
    })
}

module.exports = connectDB;