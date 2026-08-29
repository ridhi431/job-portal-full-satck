import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const MONGODB_URI = "mongodb+srv://ridhi6203_db_user:zL5w7buerpdqtFY0@cluster0.00ryzfl.mongodb.net";

const seedDB = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(`${MONGODB_URI}/newJob`);
    console.log("Connected!");

    // Clear existing data (optional, but good for clean seed)
    await mongoose.connection.db.collection('companies').deleteMany({});
    await mongoose.connection.db.collection('jobs').deleteMany({});
    console.log("Cleared existing companies and jobs.");

    // Create a Test Company
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const companyResult = await mongoose.connection.db.collection('companies').insertOne({
      name: "Google",
      email: "google@careers.com",
      password: hashedPassword,
      image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    });

    const companyId = companyResult.insertedId;
    console.log("Created Test Company 'Google' with ID:", companyId);

    // Create Sample Jobs
    const jobs = [
      {
        title: "Software Developer Engineer (SDE-1)",
        description: "<p>We are looking for a Software Developer Engineer to build next-generation web applications. You will work with React, Node.js, and MongoDB.</p>",
        location: "Bangalore",
        category: "Programming",
        level: "Beginner level",
        salary: 1200000,
        date: Date.now(),
        visible: true,
        companyId: companyId
      },
      {
        title: "Senior Product Manager",
        description: "<p>Lead our core product teams to define the product strategy and roadmap. Excellent communication and leadership skills required.</p>",
        location: "Hyderabad",
        category: "Management",
        level: "Senior level",
        salary: 3500000,
        date: Date.now() - 86400000, // 1 day ago
        visible: true,
        companyId: companyId
      },
      {
        title: "UI/UX Designer",
        description: "<p>Create beautiful user interfaces and optimize user experience. Proficiency in Figma and visual design principles is required.</p>",
        location: "Mumbai",
        category: "Designing",
        level: "Intermediate level",
        salary: 800000,
        date: Date.now() - 172800000, // 2 days ago
        visible: true,
        companyId: companyId
      }
    ];

    await mongoose.connection.db.collection('jobs').insertMany(jobs);
    console.log("Successfully seeded 3 sample jobs!");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
};

seedDB();
