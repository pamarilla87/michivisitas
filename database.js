import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB database connection established successfully");
    } catch (err) {
        console.error("MongoDB connection error. Please make sure MongoDB is running.", err);
    }
};