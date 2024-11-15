import { Schema, model } from 'mongoose'

const expenseSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Status must have a status'],
        maxlength: [100, 'Status cannot exceed 100 characters']
    },
    description: {
        type: String,
        maxlength: [400, 'Status cannot exceed 100 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Status must have an amount'],
    },
    images: {
        type: [String],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    id: {
        type: Number,
        unique: true,
    },
}, { timestamps: true })

expenseSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastExpense = await this.constructor.findOne().sort({ id: -1 });
        this.id = lastExpense ? lastExpense.id + 1 : 1;
    }
    next();
});




const Expense = model('Expense', expenseSchema)
export default Expense
