import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;

    if ([fullname, email, username, password].some((field) => {
        field?.trim() === ''
    })) {
        throw new ApiError(404, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(400, "User is already exist")
    }

    const avatarLocalPath = req.fiels?.avatar[0]?.path;
    const coverImageLocalPath = req.fiels?.coverImage[0]?.path;

    if (avatarLocalPath) {
        throw new ApiError(400, "Avatar required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const created = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!created) {
        throw new ApiError(500, "something went while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, created, "user register successfully")
    )

})

export const login = asyncHandler(async (req, res) => {
    res.status(201).json({
        message: 'ok'
    })
})