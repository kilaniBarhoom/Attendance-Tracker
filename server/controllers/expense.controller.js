import * as statusCodes from '../constants/status.constants.js';
import ReqQueryHelper from "../helpers/reqQuery.helper.js";
import * as queryHelper from "../helpers/queries/expense.queries.js";

import Expense from '../models/expense.js';
import { ExpenseSchema } from '../schemas/index.js';
import cloudinary from '../utils/cloudinary.js';
import ResponseError from '../utils/respErr.js';
import { buildPDF } from '../helpers/buildPDF.js';

// create a new expense, edit a expense, delete a expense, get all expenses, get a single expense, delete a expense after 1 day
export const getAllExpenses = async (req, res, next) => {
    const { from, to, search } = ReqQueryHelper(req.query);
    const expenses = await Expense.aggregate(queryHelper.findExpenses(from, to, search));

    const _id = expenses.map(({ _id }) => _id);

    let allTimeTotal = (await Expense.aggregate(queryHelper.findValueSum(_id)))[0];
    const allTimeTotalValue = allTimeTotal ? allTimeTotal.total : 0;

    let rangeTotal = (await Expense.aggregate(queryHelper.findValueSum(_id)))[0];
    const rangeTotalValue = rangeTotal ? rangeTotal.total : 0;

    return res.status(statusCodes.OK).json({
        success: true,
        data: {
            expenses,
            allTimeTotalValue,
            rangeTotalValue,
            from,
            to,
            search,
        },
    });
}

export const createExpense = async (req, res, next) => {
    try {
        // validate the request body using the schema


        const isValidationError = ExpenseSchema.safeParse(req.body);

        if (!isValidationError.success) {
            return next(new ResponseError(
                isValidationError.error.errors[0].message
                , statusCodes.BAD_REQUEST));
        }

        const { name, description, amount, images } = ExpenseSchema.parse(req.body);
        const user = req.user.id;

        await Expense.create({
            name,
            description,
            amount,
            images,
            user,
        });
        res.status(statusCodes.CREATED).json({
            status: 'success',
            message: 'Expense created successfully',
        });
    } catch (error) {
        next(new ResponseError(error.message, statusCodes.BAD_REQUEST));
    }
}

export const editExpense = async (req, res, next) => {
    try {

        // validate the request body using the schema
        const isValidationError = ExpenseSchema.safeParse(req.body);
        if (!isValidationError.success) {
            return next(new ResponseError(
                isValidationError.error.errors[0].message
                , statusCodes.BAD_REQUEST));
        }

        const { name, description, amount, images } = ExpenseSchema.parse(req.body);
        const user = req.user.id;

        const expense = await Expense.findByIdAndUpdate(req.params.expenseId, {
            name,
            description,
            amount,
            images,
            user,
        }, { new: true, runValidators: true });

        if (!expense) {
            return next(new ResponseError('Expense not found', statusCodes.NOT_FOUND));
        }

        res.status(statusCodes.OK).json({
            status: 'success',
            message: 'Expense updated successfully',
        });
    }
    catch (error) {
        next(new ResponseError(error.message, statusCodes.BAD_REQUEST));
    }
}

export const deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.expenseId);
        if (!expense) {
            return next(new ResponseError('Expense not found', statusCodes.NOT_FOUND));
        }
        res.status(statusCodes.OK).json({
            status: true,
            message: 'Expense deleted successfully',
        });
    } catch (error) {
        next(new ResponseError(error.message, statusCodes.BAD_REQUEST));
    }
}

export const uploadExpenseImage = async (req, res, next) => {
    const { file } = req;
    if (!file) {
        return next(
            new ResponseError(
                "Please upload a file",
                statusCodes.BAD_REQUEST
            )
        )
    }

    const { path } = file;
    const { secure_url, public_id } = await cloudinary.uploader.upload(path, {
        folder: process.env.CLOUDINARY_POSTS_FOLDER
    });
    // return the res as a string not a json
    res.status(statusCodes.OK).send(secure_url);
}

export const getSingleExpense = async (req, res, next) => {
    const expense = await Expense.findById(req.params.expenseId).populate('user', 'fullNameEnglish fullNameArabic email role');
    if (!expense) {
        return next(new ResponseError('Expense not found', statusCodes.NOT_FOUND));
    }
    res.status(statusCodes.OK).json({
        status: 'success',
        data: expense,
    });
}

export const createExpensePDF = (req, res, next) => {
    const { expenses, from, to, rangeTotalValue, allTimeTotalValue } = req.body;
    const pdfBuffer = buildPDF(expenses, from, to, rangeTotalValue, allTimeTotalValue);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=expenses.pdf');
    res.send(Buffer.concat(pdfBuffer));
}