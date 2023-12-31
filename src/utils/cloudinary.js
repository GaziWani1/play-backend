import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (localpath) => {
    try {
        if (!localpath) return null
        const response = await cloudinary.uploader.upload(localpath, {
            resource_type: "auto"
        })
        console.log("File is upload on cloudinary", response.url)
        return response
    } catch (error) {
        console.log(error)
        fs.unlinkSync(localpath);
        return null
    }
}
    ;