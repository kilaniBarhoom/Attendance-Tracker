// create payments controllers
import * as statusCodes from '../constants/status.constants.js';
import * as queryHelper from "../helpers/queries/payment.queries.js";
import ReqQueryHelper from "../helpers/reqQuery.helper.js";

import Payment from '../models/payment.js';
import User from '../models/user.js';
import { PaymentSchema } from '../schemas/index.js';
import ResponseError from '../utils/respErr.js';

export const getAllPayments = async (req, res, next) => {
    const { from: startDate, to: endDate, search, filterUser, pageNumber } = ReqQueryHelper(req.query);


    const paymentsDocuments = await Payment.countDocuments();

    const totalPages = Math.ceil(paymentsDocuments / 10);

    const payments = await Payment.aggregate(queryHelper.findPayments({ startDate, endDate, search, filterUser, loggedInUser: req.user, pageNumber }));

    return res.status(statusCodes.OK).json({
        success: true,
        data: {
            payments,
            startDate,
            endDate,
            search,
            pageNumber: pageNumber + 1,
            totalPages
        },
    });
}

export const createPayment = async (req, res, next) => {
    const { date: oldDate } = req.body;
    const isValidationError = PaymentSchema.safeParse({
        ...req.body,
        date: new Date(oldDate)
    });
    if (!isValidationError.success) {
        return next(new ResponseError(
            isValidationError.error.errors[0].message
            , statusCodes.BAD_REQUEST));
    }

    let { date, amount, note, user, type } = req.body;


    const isValidUser = await User.findById(user);
    if (!isValidUser) {
        return next(new ResponseError('User not found', statusCodes.NOT_FOUND));
    }


    const payment = await Payment.create({
        date: new Date(date),
        amount,
        user,
        note,
        createdBy: req.user._id,
    });

    res.status(statusCodes.CREATED).json({
        status: 'success',
        message: 'Payment created successfully',
        data: payment,
    });
}

export const editPayment = async (req, res, next) => {
    const { paymentId } = req.params;
    const { date: oldDate } = req.body;
    const isValidationError = PaymentSchema.safeParse({
        ...req.body,
        date: new Date(oldDate)
    });
    if (!isValidationError.success) {
        return next(new ResponseError(
            isValidationError.error.errors[0].message
            , statusCodes.BAD_REQUEST));
    }


    const isValidUser = await User.findById(user);
    if (!isValidUser) {
        return next(new ResponseError('User not found', statusCodes.NOT_FOUND));
    }

    const payment = await Payment.findByIdAndUpdate(paymentId, req.ody, { new: true, runValidators: true });

    res.status(statusCodes.OK).json({
        status: 'success',
        message: 'Payment updated successfully',
        data: payment,
    });
}

export const deletePayment = async (req, res, next) => {
    const { paymentId } = req.params;

    const payment = await Payment
        .findByIdAndDelete(paymentId);

    if (!payment) {
        return next(new ResponseError('Payment not found', statusCodes.NOT_FOUND));
    }

    res.status(statusCodes.OK).json({
        status: 'success',
        message: 'Payment deleted successfully',
    });
}

export const getSinglePayment = async (req, res, next) => {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
        return next(new ResponseError('Payment not found', statusCodes.NOT_FOUND));
    }

    res.status(statusCodes.OK).json({
        status: 'success',
        data: payment,
    });

}