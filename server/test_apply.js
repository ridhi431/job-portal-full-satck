import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Define Schemas/Models
const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    resume: { type: String },
    image: { type: String, required: true }
});

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true }
});

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    salary: { type: Number, required: true },
    date: { type: Number, required: true },
    visible: { type: Boolean, default: true }
});

const JobApplicationSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    status: { type: String, default: 'Pending' },
    date: { type: Number, required: true }
});

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);

async function testApply() {
    try {
        await mongoose.connect(`${MONGODB_URI}/newJob`);
        console.log("DB Connected.");

        // Clear previous applications if any
        await JobApplication.deleteMany({});
        console.log("Cleared test applications.");

        const user = await User.findOne({ name: "Ishvi" });
        if (!user) {
            console.error("User Ishvi not found!");
            return;
        }

        // Simulating resume update
        user.resume = "https://res.cloudinary.com/dummy/resume.pdf";
        await user.save();
        console.log("Updated Ishvi resume!");

        const job = await Job.findOne({ title: /Software/i });
        if (!job) {
            console.error("Software job not found!");
            return;
        }

        // Apply
        const app = await JobApplication.create({
            userId: user._id,
            companyId: job.companyId,
            jobId: job._id,
            date: Date.now()
        });
        console.log("Application created successfully:", app);

        // Fetch applications with populate to verify references
        const applications = await JobApplication.find({ userId: user._id })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .sort({ date: -1 })
            .exec();

        console.log("Populated Applications count:", applications.length);
        console.log("Populated Application details:");
        console.log(JSON.stringify(applications, null, 2));

        // Clean up resume and application after test
        user.resume = "";
        await user.save();
        await JobApplication.deleteMany({});
        console.log("Cleaned up database to original state.");

    } catch (err) {
        console.error("Error during test apply:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

testApply();
