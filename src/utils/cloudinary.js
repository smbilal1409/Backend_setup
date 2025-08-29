// import {v2 as cloudinary} from "cloudinary";
// import fs, { unlinkSync } from "fs";
// cloudinary.config({
//     cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
//     api_key:process.env.CLOUDINARY_API_KEY,
//     api_secret:process.env.CLOUDINARY_API_SECRET
// })
// const uploadoncloudinary=async(localfilepath)=>{
//     try {
//         if(!localfilepath){
//             console.log("❌ No local file path provided");
//             return null;
//         }
//         else{
//             const response=await cloudinary.uploader.upload(localfilepath,{
//                 resource_type:"auto"
//             })
            
//             fs.unlinkSync(localfilepath)
//             return response;
//         }
//     } catch (error) {
//         fs.unlinkSync(localfilepath);
//         return null;
//     }
// }
// export default uploadoncloudinary;
import {v2 as cloudinary} from "cloudinary";
import fs, { unlinkSync } from "fs";
import path from "path"; // Add this import

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadoncloudinary=async(localfilepath)=>{
    try {
        if(!localfilepath){
            console.log("❌ No local file path provided");
            return null;
        }
        
        // Add: Resolve absolute path
        const absolutePath = path.resolve(localfilepath);
        console.log(`📤 Uploading file: ${absolutePath}`);
        
        // Add: Check if file exists before uploading
        if (!fs.existsSync(absolutePath)) {
            console.log(`❌ File not found at path: ${absolutePath}`);
            return null;
        }

        const response=await cloudinary.uploader.upload(absolutePath,{
            resource_type:"auto"
        })
        
        // Add: Log successful upload
        console.log("✅ Cloudinary upload successful:", {
            public_id: response.public_id,
            url: response.url
        });
        
        // Add: Check if file exists before deleting
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            console.log("🗑️ Local file deleted successfully");
        }
        
        return response;
        
    } catch (error) {
        // Add: Better error logging
        console.error("❌ Cloudinary upload error:", error.message);
        
        // Add: Safe file deletion with existence check
        if (localfilepath && fs.existsSync(localfilepath)) {
            fs.unlinkSync(localfilepath);
            console.log("🗑️ Local file deleted after upload failure");
        }
        
        return null;
    }
}

export default uploadoncloudinary;