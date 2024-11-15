import { Schema, model } from 'mongoose';

const attendanceSchema = new Schema({
    date: {
        type: Date,
        required: [true, "Please provide a date"],
    },
    attendanceTime: {
        type: String,
        required: false,
        default: "00:00"
    },
    leaveTime: {
        type: String,
        required: false,
        default: "00:00"
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        required: true,
    },
    advancePayment: {
        type: Number,
        default: 0,
        required: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    note: {
        type: String,
    }
})

attendanceSchema.index({ date: -1, user: 1 }, { unique: true });

attendanceSchema.pre("save", async function (next) {
    const { status } = this;
    if (status === "absent") {
        this.attendanceTime = "00:00";
        this.leaveTime = "00:00";
    }
    next();
});

attendanceSchema.pre("findOneAndUpdate", async function (next) {
    let { status } = this._update;
    if (status === "absent") {
        this._update.attendanceTime = "00:00";
        this._update.leaveTime = "00:00";
    }
    next();
});

attendanceSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    },
});

const Attendance = model('Attendance', attendanceSchema)
export default Attendance
