import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Banknote,
  Calendar,
  ChartNoAxesColumn,
  Clock10,
  UserCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import TableRows from "./rows";
import AttendanceTableSkeleton from "./skeleton";

const AttendanceTable = ({
  attendance,
  isLoading,
}: {
  attendance: AttendanceType[];
  isLoading: boolean;
}) => {
  const { t } = useTranslation();
  const dummyArray = Array.from({ length: 5 });
  return (
    <Table className="min-w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead>
            <p className="flex items-center gap-1">
              <Calendar size={20} strokeWidth={2.3} />
              {t("Date")}
            </p>
          </TableHead>
          <TableHead>
            <p className="flex items-center gap-1">
              <UserCircle size={20} strokeWidth={2.3} />
              {t("User")}
            </p>
          </TableHead>
          <TableHead>
            <p className="flex items-center gap-1">
              <Clock10 size={20} strokeWidth={2.3} />
              {t("Attended-Left")}
            </p>
          </TableHead>
          <TableHead>
            <p className="flex items-center gap-1">
              <ChartNoAxesColumn size={20} strokeWidth={2.3} />
              {t("Status")}
            </p>
          </TableHead>
          <TableHead className="max-w-28">
            <p className="flex items-center gap-1">
              <Banknote size={20} strokeWidth={2.3} />
              {t("Adv P")}
            </p>
          </TableHead>
          {/* <TableHead className="rounded-tr-md">
            <p className="flex items-center gap-1">
              <Notebook size={20} strokeWidth={2.3} />
              {t("Note")}
            </p>
          </TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          dummyArray.map((_, index) => <AttendanceTableSkeleton key={index} />)
        ) : attendance && attendance.length ? (
          <TableRows attendance={attendance} />
        ) : (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center text-lg fond-bold py-5"
            >
              {t("No attendance found.")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default AttendanceTable;
