import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/userModel.js';

dotenv.config({});

async function migrate() {
    try {
        console.log("Connecting to Database: ", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for migration...");

        // Initialize connections, sentRequests, and receivedRequests to empty arrays if they don't exist
        const result = await User.updateMany(
            { connections: { $exists: false } },
            {
                $set: {
                    connections: [],
                    sentRequests: [],
                    receivedRequests: []
                }
            }
        );

        console.log("Migration result:", result);
        console.log("Migration complete!");
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Migration error:", error);
        process.exit(1);
    }
}

migrate();
