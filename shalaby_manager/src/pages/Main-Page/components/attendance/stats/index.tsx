import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
// import { AnalyticsOfUsersAttendancesType } from "@/pages/Main-Page/api/attendance";
import { Clock } from "lucide-react";
// import UsersAttendancesAnalyticsCard from "./users-analytics-table";
import { AttendanceChart } from "./chart";
import LoadingComponent from "@/components/shared/Loading-component";
import { useTranslation } from "react-i18next";
// import { AttendanceChart } from "./chart";

type AttendanceStatsProps = {
  avgAttendanceTime: string;
  avgLeaveTime: string;
  // analyticsOfUsersAttendances: AnalyticsOfUsersAttendancesType[];
  loadingToFetchAnalytics: boolean;
};

const AttendanceStats = ({
  avgAttendanceTime,
  avgLeaveTime,
  // analyticsOfUsersAttendances,
  loadingToFetchAnalytics,
}: AttendanceStatsProps) => {
  const { t } = useTranslation();

  return (
    <section className="flex w-full gap-2 lg:flex-row flex-col lg:h-[250px]">
      <AttendanceChart />
      <Card className="flex-1 h-full bg-muted border">
        <CardHeader className="p-4 bg-primary w-full border-b rounded-t-md">
          <CardTitle className="flex gap-2 items-center"></CardTitle>
          <Typography
            element="p"
            color="primary"
            as="h4"
            className="flex flex-col gap-2 items-center justify-center"
          >
            <img
              src="/assets/analytics.png"
              alt="analytics image"
              className="w-12 object-cover"
            />
            {t("Attendance Overview")}
          </Typography>
        </CardHeader>
        {loadingToFetchAnalytics ? (
          <LoadingComponent size={25} />
        ) : (
          <CardContent className="p-4">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 text-start">
                <Clock size={35} />
                <div className="flex flex-col w-fit justify-start items-start gap-2">
                  <Typography
                    element="span"
                    as="h6"
                    className="flex items-center gap-1"
                  >
                    {t("Average Attendance Time")}
                  </Typography>
                  <Badge variant={"outline"} className="px-6">
                    {avgAttendanceTime}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-start">
                <Clock size={35} />
                <div className="flex flex-col w-fit justify-start items-start gap-2">
                  <Typography
                    element="span"
                    as="h6"
                    className="flex items-center gap-1"
                  >
                    {t("Average Leave Time")}
                  </Typography>
                  <Badge variant={"outline"} className="px-6">
                    {avgLeaveTime}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      {/* <div className="hidden">
        <UsersAttendancesAnalyticsCard
          analyticsOfUsersAttendances={analyticsOfUsersAttendances}
          loadingToFetchAnalytics={loadingToFetchAnalytics}
        />
      </div> */}
    </section>
  );
};

export default AttendanceStats;
