declare type UserType = {
  id: string;
  email: string;
  fullNameArabic: string;
  fullNameEnglish: string | null;
  phone: string;
  secondaryPhone: string;
  active: boolean;
  role: string;
};

declare type ThemeType = "dark" | "light" | "system";

declare type LanguageType = "en" | "ar";

declare type AttendanceType = {
  id: string;
  date: string;
  status: "present" | "absent";
  attendanceTime: string;
  leaveTime: string;
  advancePayment: number;
  user: UserType;
  note: string;
  createdBy: UserType;
};

declare type UserGroupType = {
  role: string;
  users: UserType[];
};

declare type PaymentType = {
  id: string;
  date: string;
  amount: number;
  user: UserType;
  note: string;
  createdBy: UserType;
  type: "full" | "advance";
};
