import mongoose from "mongoose"; 
import { db_name } from "../constants.js";

const ConnectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${db_name}`
        );
        console.log(`Database connected successfully! DB host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Failed to connect to database:", error.message); 
        process.exit(1); 
    }
};

export default ConnectDB; 