// from previous model schemas of mongodb, create a settings schema that holds for now the type of the attendance (includes only present and absent or includes checkin and checkout) and the type of the payment (includes only advance and full or includes partial and full)

import { Schema, model } from 'mongoose';

const settingsSchema = new Schema({
    attendanceType: {
        type: String,
        enum: ['dateOnly', 'checkinchekout'],
        default: 'dateOnly',
    },
})

settingsSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    },
});

const Settings = model('Settings', settingsSchema)
export default Settings;