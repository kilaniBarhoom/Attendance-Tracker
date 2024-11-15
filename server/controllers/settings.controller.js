// settings controller

import * as statusCodes from '../constants/status.constants.js';
import Settings from '../models/settings.js';
import { SettingsSchema } from '../schemas/index.js';
import ResponseError from '../utils/respErr.js';


export const getAllSettings = async (req, res, next) => {
    const settings = await Settings.findOne();
    return res.status(statusCodes.OK).json({
        success: true,
        data: settings,
    });
}

export const editSettings = async (req, res, next) => {
    const isValidationError = SettingsSchema.safeParse(req.body);
    if (!isValidationError.success) {
        return next(new ResponseError(
            isValidationError.error.errors[0].message
            , statusCodes.BAD_REQUEST));
    }

    const settings = await Settings.findOneAndUpdate({}, req.body, { new: true });
    return res.status(statusCodes.OK).json({
        success: true,
    });
}