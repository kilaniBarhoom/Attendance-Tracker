import * as z from "zod";

export const UserSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
});
export const RegisterSchema = z.object({
    fullNameArabic: z.string().min(3),
    fullNameEnglish: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional().default(""),
    secondaryPhone: z.string().optional().default(""),
});


export const ExpenseSchema = z.object({
    name: z.string().min(1, "Name must be at least 3 characters long"),
    description: z.string().max(400, "Description could be at maximun 400 characters long").optional(),
    amount: z.number().min(1, "Amount must be at least 1"),
    images: z.array(z.string()).optional(),
});

// attendance schema
export const AttendanceSchema = z.object({
    status: z.enum(["present", "absent"]),
    advancePayment: z.number().min(0, "Advance payment must be at least 0"),
    leaveTime: z.string().optional(),
    attendanceTime: z.string().optional(),
    user: z.string().min(1, "User must be at least 1 characters long"),
    date: z.date({
        required_error: "Date is required",
    }),
    // date: z.string().min(1, "Date is required").regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in the format of yyyy-mm-dd"),
    note: z.string().optional(),
});

export const PaymentSchema = z.object({
    amount: z.number().min(0, "Advance payment must be at least 0"),
    user: z.string().min(1, "User must be at least 1 characters long"),
    date: z.date({
        required_error: "Date is required",
    }),
    note: z.string().optional(),
    type: z.enum(["advance", "full"]),
});

export const SettingsSchema = z.object({
    attendanceType: z.enum(["dateOnly", "checkinchekout"]),
});
