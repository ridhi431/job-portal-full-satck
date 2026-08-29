import 'dotenv/config';
import { clerkClient } from '@clerk/express';

async function test() {
    try {
        console.log("Testing Clerk Secret Key:", process.env.CLERK_SECRET_KEY ? "EXISTS" : "MISSING");
        console.log("Publishable Key:", process.env.CLERK_PUBLISHABLE_KEY ? "EXISTS" : "MISSING");
        
        // List users to test API connection
        const users = await clerkClient.users.getUserList({ limit: 1 });
        console.log("Clerk API connection successful! User count in response:", users.data.length);
        if (users.data.length > 0) {
            console.log("Sample User ID:", users.data[0].id);
        }
    } catch (err) {
        console.error("Clerk API verification failed:", err);
    }
}
test();
