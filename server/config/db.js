import mongoose from "mongoose";

// Function to connect to the MongoDB database
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database Connected'))
        mongoose.connection.on('error', (err) => console.log('Database Error:', err.message))
        mongoose.connection.on('disconnected', () => console.log('Database Disconnected'))

        await mongoose.connect(`${process.env.MONGODB_URI}/newJob`)
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message)
    }
}

export default connectDB