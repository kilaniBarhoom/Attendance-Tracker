import * as statusCodes from '../constants/status.constants.js';
import * as queryHelper from "../helpers/queries/attendance.queries.js";
import ReqQueryHelper from "../helpers/reqQuery.helper.js";

import Attendance from '../models/attendance.js';
import Payment from '../models/payment.js';
import User from '../models/user.js';
import { AttendanceSchema } from '../schemas/index.js';
import Roles from "../utils/authRoles.js";
import ResponseError from '../utils/respErr.js';

// create a new attendance, edit a attendance, delete a attendance, get all attendances, get a single attendance, delete a attendance after 1 day
export const getAllAttendances = async (req, res, next) => {
    const { from: startDate, to: endDate, search, filterUser, onlyAdvancePayments, pageNumber } = ReqQueryHelper(req.query);

    const attendanceDocuments = await Attendance.countDocuments();

    const totalPages = Math.ceil(attendanceDocuments / 10);

    const attendances = await Attendance.aggregate(queryHelper.findAttendance({ startDate, endDate, search, filterUser, onlyAdvancePayments, loggedInUser: req.user, pageNumber }));

    let averageAttendanceAndLeaveTime = (await Attendance.aggregate(queryHelper.calculateAverageTimes()))[0];
    const averageAttendanceTime = averageAttendanceAndLeaveTime ? averageAttendanceAndLeaveTime.averageAttendanceTime : 0;
    const averageLeaveTime = averageAttendanceAndLeaveTime ? averageAttendanceAndLeaveTime.averageLeaveTime : 0;

    const analyticsOfUsersAttendances = (await Attendance.aggregate(queryHelper.getAnalyticsOfUsersAttendances()));

    return res.status(statusCodes.OK).json({
        success: true,
        data: {
            attendances,
            startDate,
            endDate,
            search,
            averageAttendanceTime,
            averageLeaveTime,
            analyticsOfUsersAttendances,
            pageNumber: pageNumber + 1,
            totalPages
        },
    });
}

export const createAttendance = async (req, res, next) => {
    const { date: oldDate } = req.body;
    const isValidationError = AttendanceSchema.safeParse({
        ...req.body,
        date: new Date(oldDate)
    });
    if (!isValidationError.success) {
        return next(new ResponseError(
            isValidationError.error.errors[0].message
            , statusCodes.BAD_REQUEST));
    }

    let { date, status, advancePayment, leaveTime, attendanceTime, note, user } = req.body;
    if (status === 'absent' || attendanceType === 'dateOnly') {
        attendanceTime = '00:00';
        leaveTime = '00:00';
    } else

        //! TODO this should be handled in the schema
        if (status === 'present' && (!attendanceTime || attendanceTime === '' || attendanceTime === null)) {
            attendanceTime = '00:00';
            leaveTime = '00:00';
        }

    const isValidUser = await User.findById(user);
    if (!isValidUser) {
        return next(new ResponseError('User not found', statusCodes.NOT_FOUND));
    }

    if (advancePayment && advancePayment > 0) {
        await Payment.create({
            date: new Date(date),
            amount: advancePayment,
            user,
            note: 'Advance payment for attendance',
            type: 'advance',
            createdBy: req.user._id,
        });
    }

    const attendance = await Attendance.create({
        date: new Date(date),
        status,
        advancePayment,
        leaveTime,
        attendanceTime,
        user,
        note,
        createdBy: req.user._id,
    });

    res.status(statusCodes.CREATED).json({
        status: 'success',
        message: 'Attendance created successfully',
        data: attendance,
    });
}

export const editAttendance = async (req, res, next) => {
    try {
        const attendance = await Attendance.findByIdAndUpdate(req.params.attendanceId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!attendance) {
            return next(new ResponseError('Attendance not found', statusCodes.NOT_FOUND));
        }
        res.status(statusCodes.OK).json({
            status: 'success',
            message: 'Attendance updated successfully',
            data: attendance,
        });
    } catch (error) {
        next(new ResponseError(error.message, statusCodes.BAD_REQUEST));
    }
}

export const deleteAttendance = async (req, res, next) => {
    try {
        const attendance = await Attendance.findByIdAndDelete(req.params.attendanceId);
        if (!attendance) {
            return next(new ResponseError('Attendance not found', statusCodes.NOT_FOUND));
        }
        res.status(statusCodes.OK).json({
            status: true,
            message: 'Attendance deleted successfully',
        });
    } catch (error) {
        next(new ResponseError(error.message, statusCodes.BAD_REQUEST));
    }
}
export const getSingleAttendance = async (req, res, next) => {
    const attendance = await Attendance.findById(req.params.attendanceId).populate('user', 'fullNameEnglish fullNameArabic email role').populate('createdBy', 'fullNameEnglish fullNameArabic email role');

    if ((req.user.role === Roles.USER || req.user.role === Roles.SPECTATOR) && attendance.user.id !== req.user.id) {
        throw new ResponseError(
            "You are not authorized to access this attendance",
            statusCode.NOT_AUTHORIZED
        );
    }

    if (!attendance) {
        return next(new ResponseError('Attendance not found', statusCodes.NOT_FOUND));
    }
    res.status(statusCodes.OK).json({
        status: 'success',
        data: attendance,
    });
}

export const getAnalytics = async (req, res, next) => {
    const { analyticsInterval } = ReqQueryHelper(req.query);

    const analyticsOfUsersAttendancesAndLeaveTimes = (await Attendance.aggregate(queryHelper.getAnalyticsOfUsersAttendancesAndLeaveTimesByInterval({
        analyticsInterval
    })));

    return res.status(statusCodes.OK).json({
        success: true,
        data: {
            analyticsOfUsersAttendancesAndLeaveTimes,
        },
    });

}