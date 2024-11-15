import * as statusCodes from '../constants/status.constants.js';
import Session from '../models/Session.js';
import User from "../models/user.js";
import ResponseError from "../utils/respErr.js";

//  get all session and sort them decending by the created at
export const getAllSessions = async (req, res, next) => {
    const sessions = await Session.find().sort({ createdAt: -1 }).populate('user')
    res.status(statusCodes.OK).json({
        sessions
    })
}

export const revokeSession = async (req, res, next) => {
    const { sessionId } = req.params
    await Session.findByIdAndDelete(sessionId)
    res.status(statusCodes.OK).json({
        message: "Session Revoked"
    })
}