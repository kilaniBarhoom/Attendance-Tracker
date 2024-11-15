import * as statusCodes from '../constants/status.constants.js';
import Session from '../models/Session.js';
import User from "../models/user.js";
import sendToken from "../utils/jwtTokenCookie.js";
import ResponseError from "../utils/respErr.js";
import ReqQueryHelper from "../helpers/reqQuery.helper.js";
import * as queryHelper from "../helpers/queries/user.queries.js";


// get all users and sort descending by date and group by role
// /api/user/all
export const getAllUsers = async (req, res, next) => {
    const { grouped, search, pageNumber } = ReqQueryHelper(req.query);
    const userDocuments = await User.countDocuments();

    const totalPages = Math.ceil(userDocuments / 10);

    const users = await User.aggregate(queryHelper.findAllUsers({ grouped, search, pageNumber }));

    res.status(200).json({
        success: true,
        data: {
            users,
            search,
            pageNumber: pageNumber + 1,
            totalPages
        }
    });
};

// /api/user/
export const getOwnProfile = async (req, res, next) => {

    res.status(statusCodes.OK).json({
        user: req.user
    })
}

export const createUser = async (req, res, next) => {
    const { fullNameEnglish, fullNameArabic, email, password, phone, secondaryPhone } = req.body;
    if (!email || !password || !fullNameEnglish || !fullNameArabic) {
        return next(
            new ResponseError(
                "Enter all required fields",
                statusCodes.BAD_REQUEST
            )
        )
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return next(
            new ResponseError(
                "User already exists",
                statusCodes.BAD_REQUEST
            )
        )
    }

    const userData = {
        email,
        password,
        fullNameEnglish,
        fullNameArabic,
        phone: phone || "",
        secondaryPhone: secondaryPhone || "",
    }

    const user = await User.create(userData);

    return res.status(statusCodes.CREATED).json({
        message: "User created",
        data: {
            user
        }
    })
}

// /api/user/update-password
export const updatePassword = async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body
    if (!oldPassword || !newPassword || !confirmPassword) {
        return next(
            new ResponseError(
                "Enter all required fields",
                statusCodes.BAD_REQUEST
            )
        )
    }
    const user = await User.findById(req.user._id).select('+password')

    const validOldPassword = await user.comparePasswords(oldPassword)
    if (!validOldPassword) {
        return next(
            new ResponseError(
                "Password is invalid",
                statusCodes.BAD_REQUEST
            )
        )
    }

    if (newPassword != confirmPassword) {
        return next(
            new ResponseError(
                "Passwords do not match",
                statusCodes.BAD_REQUEST
            )
        )
    }

    // return error if the old password is the same as the new password
    if (oldPassword == newPassword) {
        return next(
            new ResponseError(
                "Old password and new password cannot be the same",
                statusCodes.BAD_REQUEST
            )
        )
    }

    user.password = newPassword;
    await user.save()
    sendToken(user, statusCodes.OK, res)
}

export const updateUser = async (req, res, next) => {
    const { userId } = req.params
    await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true
    })

    res.status(statusCodes.OK).json({
        message: "User updated"
    })
}

// /api/user/delete-profile
export const deleteOwnProfile = async (req, res, next) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        return next(
            new ResponseError(
                "User not found",
                statusCodes.NOT_FOUND
            )
        )
    }

    await User.findByIdAndDelete(req.user._id)
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return next(
            new ResponseError("You are not logged in", statusCodes.BAD_REQUEST)
        );
    }

    await Session.findOneAndDelete({ refreshToken });
    res.clearCookie("refreshToken");

    res.status(statusCodes.OK).json({
        message: "User deleted"
    })
}

//Get own role
// /api/user/role
export const getRole = async (req, res, next) => {
    const user = await User.findById(req.user._id)
    res.status(statusCodes.OK).json({
        role: user.role
    })
}




export const toggleActivateUser = async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(
            new ResponseError(
                "User not found",
                statusCodes.NOT_FOUND
            )
        )
    }
    if (user.role === "superadmin") {
        return next(
            new ResponseError(
                "Cannot deactivate superadmin",
                statusCodes.BAD_REQUEST
            )
        )
    }
    if (user.id === req.user._id) {
        return next(
            new ResponseError(
                "Cannot deactivate yourself",
                statusCodes.BAD_REQUEST
            )
        )
    }
    user.active = !user.active
    await user.save()
    res.status(statusCodes.OK).json({
        message: "User updated"
    })
}

// /api/user/:userId, change the role using patch
export const changeRole = async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(
            new ResponseError(
                "User not found",
                statusCodes.NOT_FOUND
            )
        )
    }
    if (user.role === "superadmin") {
        return next(
            new ResponseError(
                "Cannot change superadmin role",
                statusCodes.BAD_REQUEST
            )
        )
    }
    if (user.id === req.user._id) {
        return next(
            new ResponseError(
                "Cannot change your own role",
                statusCodes.BAD_REQUEST
            )
        )
    }
    user.role = req.body.role
    await user.save()
    res.status(statusCodes.OK).json({
        message: "User updated"
    })
}