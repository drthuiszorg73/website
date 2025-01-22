const mongoose = require('mongoose');
require('dotenv').config(); // Add this line to load .env variables

// MongoDB Atlas connection string
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected!');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err.message);
      console.log('Retrying MongoDB connection in 5 seconds...');
      setTimeout(connectDB, 5000); // Retry after 5 seconds
    }
};

module.exports = connectDB;