import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"
import { clerkClient } from "@clerk/express"

// Get User Data
export const getUserData = async (req, res) => {

    const userId = req.auth.userId

    try {

        let user = await User.findById(userId)

        if (!user) {
            // Fetch user details from Clerk using Clerk API and auto-register in MongoDB
            const clerkUser = await clerkClient.users.getUser(userId)
            
            const userData = {
                _id: userId,
                email: clerkUser.emailAddresses[0].emailAddress,
                name: ((clerkUser.firstName || "") + " " + (clerkUser.lastName || "")).trim() || "User",
                image: clerkUser.imageUrl,
                resume: ''
            }
            user = await User.create(userData)
        }

        res.json({ success: true, user })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}


// Apply For Job
export const applyForJob = async (req, res) => {

    const { jobId } = req.body

    const userId = req.auth.userId

    try {

        const isAlreadyApplied = await JobApplication.find({ jobId, userId })

        if (isAlreadyApplied.length > 0) {
            return res.json({ success: false, message: 'Already Applied' })
        }

        const jobData = await Job.findById(jobId)

        if (!jobData) {
            return res.json({ success: false, message: 'Job Not Found' })
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        res.json({ success: true, message: 'Applied Successfully' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Get User Applied Applications Data
export const getUserJobApplications = async (req, res) => {

    try {

        const userId = req.auth.userId

        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .sort({ date: -1 })
            .exec()

        if (!applications) {
            return res.json({ success: false, message: 'No job applications found for this user.' })
        }

        return res.json({ success: true, applications })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Update User Resume
export const updateUserResume = async (req, res) => {
    try {

        const userId = req.auth.userId

        const resumeFile = req.file

        let userData = await User.findById(userId)

        if (!userData) {
            // Fetch user details from Clerk using Clerk API and auto-register in MongoDB
            const clerkUser = await clerkClient.users.getUser(userId)
            
            userData = await User.create({
                _id: userId,
                email: clerkUser.emailAddresses[0].emailAddress,
                name: ((clerkUser.firstName || "") + " " + (clerkUser.lastName || "")).trim() || "User",
                image: clerkUser.imageUrl,
                resume: ''
            })
        }

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path, { resource_type: 'auto' })
            userData.resume = resumeUpload.secure_url
        }

        await userData.save()

        return res.json({ success: true, message: 'Resume Updated' })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}