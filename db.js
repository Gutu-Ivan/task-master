const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Выход с ошибкой, если не удается подключиться к базе данных
    }
};

module.exports = connectDB;
