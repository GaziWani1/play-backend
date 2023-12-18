import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];


        const decodeJwt = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeJwt?._id).select("-password -refreshToken")

        if (!user)
            throw new ApiError(401, "Invalid Access Token")

        req.user = user
        next()
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong")
    }
})