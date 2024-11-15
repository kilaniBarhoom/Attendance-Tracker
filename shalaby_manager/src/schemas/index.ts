import * as z from "zod";

export const LoginFormSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;

export const AttendanceFormSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  attendanceTime: z.string().optional(),
  leaveTime: z.string().optional(),
  user: z.string().min(1, "User is required"),
  status: z.string().min(1, "Status is required"),
  advancePayment: z.string().default("0"),
  note: z.string().optional(),
});

export type AttendanceFormSchemaType = z.infer<typeof AttendanceFormSchema>;

export const ChangePasswordFormSchema = z
  .object({
    oldPassword: z.string().min(1, "Old Password is required"),
    newPassword: z.string().min(1, "New Password is required"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormSchemaType = z.infer<
  typeof ChangePasswordFormSchema
>;

export const UsersFormSchema = z.object({
  fullNameEnglish: z.string().min(1, "Full name in english is required"),
  fullNameArabic: z.string().min(1, "Full name in arabic is required"),
  email: z.string().min(1, "Email is required"),
  password: z.string({
    required_error: "Password is required",
  }),
  phone: z.string().optional(),
  secondaryPhone: z.string().optional(),
  role: z.string().default("user"),
});

export type UsersFormSchemaType = z.infer<typeof UsersFormSchema>;

// same user schema but without password
export const UsersEditFormSchema = z.object({
  fullNameEnglish: z.string().min(1, "Full name in english is required"),
  fullNameArabic: z.string().min(1, "Full name in arabic is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().optional(),
  secondaryPhone: z.string().optional(),
  role: z.string().default("user"),
});

export type UsersEditFormSchemaType = z.infer<typeof UsersEditFormSchema>;

export const PaymentFormSchema = z.object({
  amount: z.string({
    required_error: "Amount is required",
  }),
  user: z.string().min(1, "User must be at least 1 characters long"),
  date: z.date({
    required_error: "Date is required",
  }),
  note: z.string().optional(),
  type: z.enum(["advance", "full"]),
});

export type PaymentFormSchemaType = z.infer<typeof PaymentFormSchema>;
