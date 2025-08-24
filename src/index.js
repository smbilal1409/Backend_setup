import dotenv from "dotenv";
import Connectdb from "./db/index.js";
import { app } from "./app.js"; 
dotenv.config({
    path: "./.env"  
});

if (process.env.NODE_ENV !== "production") {
    console.log("Environment variables loaded:", process.env);
}

Connectdb()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server running at port ${process.env.PORT}`);
        console.log(`API URL: http://localhost:${process.env.PORT}/api/v1/user/register`);
    });
})
.catch((error) => {
    console.log("MongoDB connection failed:", error);
});