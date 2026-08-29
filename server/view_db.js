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

async function inspect() {
    try {
        await mongoose.connect(`${MONGODB_URI}/newJob`);
        console.log("DB Connected.");

        const users = await User.find();
        console.log("USERS:", JSON.stringify(users, null, 2));

        const apps = await JobApplication.find();
        console.log("APPLICATIONS:", JSON.stringify(apps, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
inspect();
