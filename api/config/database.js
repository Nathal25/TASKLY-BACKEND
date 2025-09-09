const mongoose= require('mongoose');
require('dotenv').config();

const connectDB= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

const disconnectDB= async()=>{
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
    disconnectDB
};
