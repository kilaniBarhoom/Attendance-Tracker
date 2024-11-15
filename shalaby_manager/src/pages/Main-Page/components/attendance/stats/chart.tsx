import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetAnalyticsOfAttendanceAndLeaveQuery } from "@/pages/Main-Page/api/attendance";
import LoadingComponent from "@/components/shared/Loading-component";
import Typography from "@/components/ui/typography";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ny } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const chartConfig = {
  avgAttendanceTime: {
    label: "avgAttendanceTime",
    color: "hsl(var(--chart-2))",
  },
  avgLeaveTime: {
    label: "avgLeaveTime",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

function timeStringToMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTimeString(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, "0")}`;
}

export function AttendanceChart() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const {
    data: analyticsOfUsersAttendancesAndLeaveTimes,
    isLoading: isLoadingToFetchAnalyticsOfAttendanceAndLeaveTimes,
  } = useGetAnalyticsOfAttendanceAndLeaveQuery();

  // Prepare chart data with numeric conversion for charting
  const processedData =
    analyticsOfUsersAttendancesAndLeaveTimes?.analyticsOfUsersAttendancesAndLeaveTimes?.map(
      (entry) => ({
        month: entry.month,
        year: entry.year,
        avgAttendanceTime: timeStringToMinutes(entry.avgAttendanceTime),
        avgLeaveTime: timeStringToMinutes(entry.avgLeaveTime),
        originalAvgAttendanceTime: entry.avgAttendanceTime, // For display purposes
        originalAvgLeaveTime: entry.avgLeaveTime, // For display purposes
      })
    );

  const [searchParams, setSearchParams] = useSearchParams();
  const analyticsInterval = searchParams.get("analyticsInterval") || "monthly";

  const setAnalyticsInterval = (interval: string) => {
    setSearchParams((prev) => {
      prev.delete("analyticsInterval");
      prev.set("analyticsInterval", interval);
      return prev;
    });
  };

  return (
    <Card className="flex-1 bg-muted">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center justify-between">
            {t("Attendance Overview Chart")}
          </CardTitle>
          <div className="flex items-center divide-x border rounded-md">
            <Button
              onClick={() => {
                setAnalyticsInterval("monthly");
              }}
              variant={"none"}
              className={ny("py-1 px-2 rounded-l-md", {
                "bg-primary": analyticsInterval === "monthly",
              })}
            >
              {t("Monthly")}
            </Button>
            <Button
              onClick={() => {
                setAnalyticsInterval("yearly");
              }}
              variant={"none"}
              className={ny("py-1 px-2 rounded-r-md", {
                "bg-primary": analyticsInterval === "yearly",
              })}
            >
              {t("Yearly")}
            </Button>
          </div>
        </div>
        <CardDescription>
          {analyticsInterval === "yearly"
            ? `${
                // current year and previous 3 years
                new Date().getFullYear() - 3
              }-${new Date().getFullYear()}`
            : `January - December ${format(new Date(), "y")}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingToFetchAnalyticsOfAttendanceAndLeaveTimes ? (
          <LoadingComponent size={26} />
        ) : processedData && processedData.length > 0 ? (
          <ChartContainer
            lang={i18n.language}
            dir={dir}
            className="h-[94px] w-full"
            config={chartConfig}
          >
            <LineChart
              className="w-full"
              accessibilityLayer
              data={processedData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={analyticsInterval === "yearly" ? "year" : "month"}
                axisLine
                tickMargin={8}
                tickFormatter={(value) => {
                  if (analyticsInterval === "yearly")
                    return format(new Date(String(value)), "yy");
                  const date = new Date(2023, value - 1, 1);
                  return date
                    .toLocaleString("default", { month: "long" })
                    .slice(0, 3);
                }}
              />
              <ChartTooltip
                cursor
                content={<ChartTooltipContent indicator="dot" />}
                formatter={(value: number, name: string) => {
                  return `${name}: ${minutesToTimeString(value)}`;
                }}
              />
              <Line
                dataKey="avgAttendanceTime"
                type="monotone"
                stroke="var(--color-avgAttendanceTime)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-avgAttendanceTime)",
                }}
                activeDot={{
                  r: 6,
                }}
              >
                {/* <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} /> */}
              </Line>
              <Line
                dataKey="avgLeaveTime"
                type="monotone"
                stroke="var(--color-avgLeaveTime)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-avgLeaveTime)",
                }}
                activeDot={{
                  r: 6,
                }}
              >
                {/* <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} /> */}
              </Line>
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Typography element="p" as="h4">
              {t("No data available")}
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
