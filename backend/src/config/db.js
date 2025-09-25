const mongoose = require('mongoose');

const DB_Connection = async() =>{
    const MONGO_URI = process.env.MONGO_URI;
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected to Successfully...!")
    } catch (error) {
        console.log("❎ DB not Connected..", error.message)
        process.exit(0);
    }
};

module.exports = {DB_Connection}