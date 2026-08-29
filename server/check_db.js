import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const userSchema = new mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    resume: String,
    image: String
});

const JobApplicationSchema = new mongoose.Schema({
    userId: String,
    companyId: mongoose.Schema.Types.ObjectId,
    jobId: mongoose.Schema.Types.ObjectId,
    status: String,
    date: Number
});

const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function check() {
    try {
        await mongoose.connect(`${MONGODB_URI}/newJob`);
        console.log("Database Connected!");
        
        const users = await User.find();
        console.log("Users in DB:");
        console.log(users.map(u => ({ id: u._id, name: u.name, resume: u.resume })));

        const apps = await JobApplication.find().populate('jobId');
        console.log("Job Applications in DB:");
        console.log(apps);
    } catch(err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
check();
