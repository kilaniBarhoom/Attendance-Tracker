import jwt from 'jsonwebtoken';
import * as statusCodes from '../constants/status.constants.js';
import Session from '../models/Session.js';
import User from "../models/user.js";
import sendToken from "../utils/jwtTokenCookie.js";
import ResponseError from '../utils/respErr.js';


// /api/auth/login
export const login = async (req, res, next) => {
    const { refreshtoken } = req.cookies
    if (refreshtoken) {
        await Session.deleteOne({ refreshtoken })
    }
    const { email, password } = req.body;
    if (!email || !password) {
        return next(
            new ResponseError(
                "Enter all required fields",
                statusCodes.BAD_REQUEST
            )
        )
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(
            new ResponseError(
                "Invalid email or password",
                statusCodes.NOT_AUTHENTICATED
            )
        )
    }

    const isPasswordValid = await user.comparePasswords(password)

    if (!isPasswordValid) {
        return next(
            new ResponseError(
                "Invalid email or password",
                statusCodes.NOT_AUTHENTICATED
            )
        )
    }

    if (!user.active) {
        return next(
            new ResponseError(
                "User has been deactivated",
                statusCodes.NOT_AUTHENTICATED
            )
        )
    }


    req.user = user;
    sendToken(user, statusCodes.OK, res)


}



export const refreshToken = async (req, res, next) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return next(
            new ResponseError("You are not logged in", statusCodes.BAD_REQUEST)
        );
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            res.clearCookie("refreshToken");
            return next(
                new ResponseError("User account deleted", statusCodes.NOT_FOUND)
            );
        }

        if (!user.active) {
            return next(
                new ResponseError(
                    "User has been deactivated",
                    statusCodes.NOT_AUTHENTICATED
                )
            )
        }

        const session = await Session.findOne({ refreshToken });
        if (!session) {
            res.clearCookie("refreshToken");
            return next(
                new ResponseError("Please login again.", statusCodes.NOT_AUTHENTICATED)
            );
        }

        return res.status(statusCodes.OK).json({
            success: true,
            message: "Refreshed Access Token Successfully",
            token: user.genJwtoken(session._id),
        });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.clearCookie("refreshToken");
            await Session.findOneAndDelete({ refreshToken });
            return next(
                new ResponseError(
                    "Token Expired. Please login again",
                    statusCodes.NOT_AUTHENTICATED
                )
            );
        }
        return next(error);
    }
};


// /api/auth/logout
export const logout = async (req, res, next) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return next(
            new ResponseError("You are not logged in", statusCodes.BAD_REQUEST)
        );
    }

    await Session.findOneAndDelete({ refreshToken });
    res.clearCookie("refreshToken");
    return res.status(statusCodes.OK).json({
        success: true,
        message: "Logged out successfully",
    });
};

