import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";
import Company from "./models/Company.js";
import User from "./models/User.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function inspect() {
    try {
        await mongoose.connect(`${MONGODB_URI}/newJob`);
        console.log("DB Connected.");

        const jobs = await Job.find();
        console.log("JOBS count:", jobs.length);
        console.log("JOBS:", JSON.stringify(jobs, null, 2));

        const companies = await Company.find();
        console.log("COMPANIES count:", companies.length);
        console.log("COMPANIES:", JSON.stringify(companies, null, 2));

        const users = await User.find();
        console.log("USERS count:", users.length);
        
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
inspect();
