import { TableCell, TableRow } from "@/components/ui/table";
import Typography from "@/components/ui/typography";
// import { useDeleteCostMutation } from "@/features/MainPage/api/manage-employees/attendance";
import { dateToString, stringToDate } from "@/lib/utils";
import { format } from "date-fns";
import { ar, enGB } from "date-fns/locale";
import { useTranslation } from "react-i18next";
// import AddEditCostDialog from "../add-edit-attendee-dialog";
// import { useDeleteCostMutation } from "@/features/MainPage/api/attendance";

import { UserAvatar } from "@/components/ui/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Check, MoveRight, X, MoveLeft } from "lucide-react";
const TableRows = ({ attendance }: { attendance: AttendanceType[] }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const dir = i18n.dir();

  // const { mutate: deleteCost } = useDeleteCostMutation();
  return (
    <>
      {attendance.map((attendee) => (
        <TableRow key={attendee.id} className="cursor-pointer">
          <TableCell className="w-44">
            <div className="flex items-center gap-2">
              <Typography element="p" className="font-semibold">
                {format(stringToDate(attendee.date), "eee, dd/MM/y", {
                  locale: language === "ar" ? ar : enGB,
                })}
              </Typography>
              {attendee.date === dateToString(new Date()) && (
                <sub className="text-primary"> ({t("Today")})</sub>
              )}
            </div>
          </TableCell>
          <TableCell className="min-w-max">
            <UserAvatar
              name={
                language === "ar"
                  ? attendee?.user.fullNameArabic
                  : attendee?.user.fullNameEnglish ?? ""
              }
              description={attendee?.user.email}
              imageClassName="bg-background border size-8"
              descriptionType="email"
            />
          </TableCell>
          <TableCell className="max-w-10">
            {attendee?.attendanceTime === "00:00" &&
            attendee?.leaveTime === "00:00" ? (
              <Typography
                element="p"
                as="smallText"
                className="text-center font-bold"
              >
                -
              </Typography>
            ) : attendee?.attendanceTime !== "00:00" &&
              attendee?.leaveTime === "00:00" ? (
              <div className="flex items-center gap-2">
                <Typography
                  element="p"
                  as="p"
                  color="white"
                  className="bg-green-700 rounded-md px-1"
                >
                  {attendee?.attendanceTime}
                </Typography>
                <MoveRight size={15} />
                <Typography element="p" as="p">
                  -
                </Typography>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Typography
                  element="p"
                  as="p"
                  color="white"
                  className="bg-green-700 rounded-md px-1"
                >
                  {attendee?.attendanceTime}
                </Typography>
                {dir === "ltr" && <MoveRight size={15} />}
                {dir === "rtl" && <MoveLeft size={15} />}
                <Typography
                  element="p"
                  as="p"
                  color="white"
                  className="bg-red-700 rounded-md px-1"
                >
                  {attendee?.leaveTime}
                </Typography>
              </div>
            )}
          </TableCell>
          <TableCell className="w-28">
            {attendee.status === "present" ? (
              <Badge
                className="bg-green-500 justify-center rounded-md"
                size={"sm"}
              >
                <Check size={16} strokeWidth={3} />
              </Badge>
            ) : (
              <Badge
                className="bg-red-500 justify-center rounded-md"
                size={"sm"}
              >
                <X size={16} strokeWidth={3} />
              </Badge>
            )}
          </TableCell>

          <TableCell>
            <Typography element="p" as="largeText">
              {attendee.advancePayment}&nbsp;
              <sup className="text-lg">₪</sup>
            </Typography>
          </TableCell>
          {/* <TableCell className=" min-w-36">
            {!!attendee.description ? (
              <Popover>
                <PopoverTrigger className="max-w-[30ch] text-nowrap truncate">
                  {attendee.description}
                </PopoverTrigger>
                <PopoverContent className="w-60 p-2 h-fit overflow-auto">
                  {attendee.description}
                </PopoverContent>
              </Popover>
            ) : (
              <Typography
                element="p"
                as="smallText"
                className="text-center font-bold"
              >
                -
              </Typography>
            )}
          </TableCell> */}
          {/* <TableCell className="">
            <Typography
              title={attendee.note}
              element="p"
              as="smallText"
              className="max-w-48 text-nowrap text-ellipsis font-medium overflow-x-hidden"
            >
              {attendee.note || "---"}
            </Typography>
           
          </TableCell> */}
        </TableRow>
      ))}
    </>
  );
};

export default TableRows;
