import { Schema, model } from 'mongoose';

const paymentSchema = new Schema({
    date: {
        type: Date,
        required: [true, "Please provide a date"],
    },
    amount: {
        type: Number,
        default: 0,
        required: [true, "Please provide an amount"],
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
    },
    type: {
        type: String,
        enum: ['advance', 'full'],
        default: 'full',
    }
})


paymentSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    },
});

const Payment = model('Payment', paymentSchema)
export default Payment
