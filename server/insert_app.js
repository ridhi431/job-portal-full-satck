import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const JobApplicationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, default: 'Pending' },
    date: { type: Number, required: true }
});

const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);

async function insertApp() {
    try {
        await mongoose.connect(`${MONGODB_URI}/newJob`);
        console.log("DB Connected.");

        // Clear any old ones
        await JobApplication.deleteMany({ userId: "user_35BSupk6lkKKB0dI9r4UsI0gZVN" });

        // Insert new application
        const app = await JobApplication.create({
            userId: "user_35BSupk6lkKKB0dI9r4UsI0gZVN",
            companyId: new mongoose.Types.ObjectId("6a92b07565c953bf8aef26d6"), // Google
            jobId: new mongoose.Types.ObjectId("6a92b07565c953bf8aef26d7"), // Software Developer Engineer
            date: Date.now()
        });

        console.log("Created test application for Ishvi:", app);
    } catch(err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
insertApp();
