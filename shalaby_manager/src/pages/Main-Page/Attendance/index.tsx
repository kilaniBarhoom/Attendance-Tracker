import BreadcrumbComponent from "@/components/shared/bread-crumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Typography from "@/components/ui/typography";
import { format } from "date-fns";
import { ar, enGB } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  UserPlus,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import AttendanceWrapper from "../components/attendance/attendance-wrapper";
import { Badge } from "@/components/ui/badge";
import AddEditAttendanceDialogDrawer from "../components/attendance/add-edit-dialog-drawer";
import { useSearchParams } from "react-router-dom";
import { dateToString, stringToDate } from "@/lib/utils";
import { useEffect } from "react";

const Attendance = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const dir = i18n.dir();
  const [searchParams, setSearchParams] = useSearchParams();
  const from = searchParams.get("from") || dateToString(new Date());

  const setFromDate = (from: string) => {
    setSearchParams((prev) => {
      prev.delete("from");
      if (from) {
        prev.set("from", from);
      }
      return prev;
    });
  };

  useEffect(() => {
    if (
      !searchParams.get("from") ||
      searchParams.get("from") === "" ||
      searchParams.get("from") === "1970-01-01"
    ) {
      setFromDate(dateToString(new Date()));
    }
  }, [from]);

  return (
    <div className="flex flex-col gap-2">
      <Helmet>
        <title>Attendance</title>
      </Helmet>
      <BreadcrumbComponent
        tree={[
          {
            title: "Attendance",
          },
        ]}
        currentPage={"All"}
      />
      <div className="w-full flex items-center flex-wrap justify-between gap-2">
        <div className="flex lg:w-fit w-full items-center sm:justify-normal justify-between gap-2 h-8">
          <Typography
            className="flex items-center gap-2"
            element="h4"
            as="h4"
            color="secondary"
          >
            <FileSpreadsheet size={35} fill="#99BFC5" stroke="#000" />
            {t("Attendance")}
          </Typography>
          <Separator orientation="vertical" />
          <Badge className="gap-2 px-1 sm:w-fit w-full bg-green-300 hover:bg-green-400 justify-between">
            <Button
              variant="secondary"
              size={"xs"}
              onClick={() => {
                const previousDate = dateToString(
                  new Date(new Date(from).setDate(new Date(from).getDate() - 1))
                );
                setFromDate(previousDate);
              }}
              aria-label="previous-day"
            >
              {dir === "ltr" && <ChevronLeft />}
              {dir === "rtl" && <ChevronRight />}
            </Button>
            <div className="flex items-center gap-2 lg:text-lg text-xs">
              <Typography
                element="p"
                as={"smallText"}
                className="font-semibold"
                color="black"
              >
                {format(
                  from ? stringToDate(from) : new Date(),
                  "eee, dd/MM/y",
                  {
                    locale: language === "ar" ? ar : enGB,
                  }
                )}
              </Typography>
            </div>
            <Button
              variant="secondary"
              size={"xs"}
              onClick={() => {
                const nextDate = dateToString(
                  new Date(new Date(from).setDate(new Date(from).getDate() + 1))
                );
                setFromDate(nextDate);
              }}
              aria-label="next-day"
            >
              {dir === "ltr" && <ChevronRight />}
              {dir === "rtl" && <ChevronLeft />}
            </Button>
          </Badge>
        </div>
        <div className="flex items-center lg:w-fit w-full">
          <AddEditAttendanceDialogDrawer>
            <Button
              className="px-6 lg:py-4 py-6 lg:w-fit w-full border-2"
              Icon={UserPlus}
            >
              {t("Add Attendance")}
            </Button>
          </AddEditAttendanceDialogDrawer>
        </div>
      </div>
      <AttendanceWrapper />
    </div>
  );
};

export default Attendance;
