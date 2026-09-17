import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"
import { clerkClient } from "@clerk/express"

// Helper function to find or auto-register user from Clerk
const getOrRegisterUser = async (userId) => {
    let user = await User.findById(userId)
    if (!user) {
        const clerkUser = await clerkClient.users.getUser(userId)
        const email = clerkUser.emailAddresses?.[0]?.emailAddress || ""
        const name = ((clerkUser.firstName || "") + " " + (clerkUser.lastName || "")).trim() || "User"
        const image = clerkUser.imageUrl || ""

        if (email) {
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                const oldResume = existingUser.resume || ''
                await User.deleteOne({ _id: existingUser._id })
                user = await User.create({
                    _id: userId,
                    email,
                    name,
                    image,
                    resume: oldResume
                })
            } else {
                user = await User.create({
                    _id: userId,
                    email,
                    name,
                    image,
                    resume: ''
                })
            }
        } else {
            user = await User.create({
                _id: userId,
                email: `${userId}@placeholder.com`,
                name,
                image,
                resume: ''
            })
        }
    }
    return user
}

// Get User Data
export const getUserData = async (req, res) => {
    const userId = req.auth?.userId

    if (!userId) {
        return res.json({ success: false, message: 'Unauthorized: Please login first' })
    }

    try {
        const user = await getOrRegisterUser(userId)
        res.json({ success: true, user })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Apply For Job
export const applyForJob = async (req, res) => {
    const { jobId } = req.body
    const userId = req.auth?.userId

    if (!userId) {
        return res.json({ success: false, message: 'Unauthorized: Please login first' })
    }

    if (!jobId) {
        return res.json({ success: false, message: 'Job ID is required' })
    }

    try {
        // Ensure user exists in MongoDB
        await getOrRegisterUser(userId)

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
    const userId = req.auth?.userId

    if (!userId) {
        return res.json({ success: false, message: 'Unauthorized: Please login first' })
    }

    try {
        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .sort({ date: -1 })
            .exec()

        console.log(`[getUserJobApplications] userId: ${userId}, found: ${applications.length} applications`)

        if (!applications || applications.length === 0) {
            return res.json({ success: true, applications: [] })
        }

        return res.json({ success: true, applications })

    } catch (error) {
        console.error(`[getUserJobApplications] Error for userId ${userId}:`, error.message)
        res.json({ success: false, message: error.message })
    }
}

// Update User Resume
export const updateUserResume = async (req, res) => {
    const userId = req.auth?.userId

    if (!userId) {
        return res.json({ success: false, message: 'Unauthorized: Please login first' })
    }

    try {
        const resumeFile = req.file
        let userData = await getOrRegisterUser(userId)

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path, { resource_type: 'auto' })
            userData.resume = resumeUpload.secure_url
            await userData.save()
        }

        return res.json({ success: true, message: 'Resume Updated' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}