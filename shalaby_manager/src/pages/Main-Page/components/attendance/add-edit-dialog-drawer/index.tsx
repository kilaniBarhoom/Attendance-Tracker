import AttendanceForm from "@/components/forms/main-page/attendance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { stringToDate } from "@/lib/utils";
import { useAttendanceFormMutation } from "@/pages/Main-Page/api/attendance";
import { AttendanceFormSchema, AttendanceFormSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type AddEditAttendanceDialogDrawerProps = {
  children: React.ReactNode;
  attendance?: AttendanceType;
};

const AddEditAttendanceDialogDrawer = ({
  children,
  attendance,
}: AddEditAttendanceDialogDrawerProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { t } = useTranslation();

  const attendanceForm = useForm<AttendanceFormSchemaType>({
    resolver: zodResolver(AttendanceFormSchema),
    defaultValues: {
      date: (attendance && stringToDate(attendance.date)) || new Date(),
      attendanceTime: attendance?.attendanceTime || "",
      leaveTime: attendance?.leaveTime || "",
      user: String(attendance?.user?.id) || "",
      status: attendance?.status || "",
      advancePayment: String(attendance?.advancePayment) || "0",
      note: attendance?.note || "",
    },
  });

  const { mutateAsync } = useAttendanceFormMutation();

  const onSubmit = async (data: AttendanceFormSchemaType) => {
    try {
      toast(t("Saving employee"), {
        description: "",
      });
      await mutateAsync({
        data: data,
        attendanceId: attendance?.id,
      });
      attendanceForm.reset();
      setDialogOpen(false);
    } catch (error: any) {
      toast(t("Error"), {
        description: t(error?.response?.data?.[0]) || t("Something went wrong"),
      });
    }
  };

  const isLoading = attendanceForm.formState.isSubmitting;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {attendance ? t("Edit attendance") : t("Add a new attendance")}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <AttendanceForm
            attendanceForm={attendanceForm}
            isLoading={isLoading}
            onSubmit={onSubmit}
            attendance={attendance}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditAttendanceDialogDrawer;
