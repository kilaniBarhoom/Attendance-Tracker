// Check if user is authorised to do an action or not

import jwt from 'jsonwebtoken'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED, NOT_FOUND } from "../constants/status.constants.js"
import Session from "../models/Session.js"
import User from "../models/user.js"
import ResponseError from "../utils/respErr.js"

//use asynchandler

export const auth = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }


    if (!token) {
        return next(
            new ResponseError(
                "Please login to continue",

                NOT_AUTHENTICATED
            )
        );
    }

    //verify if the user is authorized
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id);
        const session = await Session.findById(decoded.sessionId);
        if (!session)
            return next(
                new ResponseError("Please login again", NOT_AUTHENTICATED)
            );
        if (!req.user) {
            return next(
                new ResponseError(
                    "User account was deleted",
                    NOT_FOUND
                )
            )
        }
        req.user = req.user;
        return next();
    } catch (error) {
        next(
            new ResponseError(
                "Not Authorized",
                NOT_AUTHORIZED
            )
        )
    }


}

export const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ResponseError(
                "You have no access to this resource",
                NOT_AUTHORIZED
            ))
        }
        next()
    }
}