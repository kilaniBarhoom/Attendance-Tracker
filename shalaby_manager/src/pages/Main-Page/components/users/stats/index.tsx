import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Typography from "@/components/ui/typography";
import { Clock, LogIn, LogOut } from "lucide-react";
// import { AttendanceChart } from "./chart";

type AttendanceStatsProps = {
  avgAttendanceTime: string;
  avgLeaveTime: string;
};

const AttendanceStats = ({
  avgAttendanceTime,
  avgLeaveTime,
}: AttendanceStatsProps) => {
  return (
    <section className="flex flex-col w-full  gap-2">
      {/* <div className="flex items-center h-full gap-2 w-full"> */}
      <Card className="flex-1 h-full bg-secondary shadow-inner shadow-black border">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Clock stroke="#99BFC5" /> AVG Attendance/Leave Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-5 h-16">
            <div className="flex flex-col gap-2 text-start">
              <Typography
                element="span"
                as="mutedText"
                className="flex items-center gap-2"
              >
                <LogIn />
                Average Attendance Time
              </Typography>
              <Badge className="w-fit flex items-center gap-2 ml-2">
                <Clock size={15} /> {avgAttendanceTime}
              </Badge>
            </div>
            <Separator orientation="vertical" className="bg-primary" />
            <div className="flex flex-col gap-2 text-start">
              <Typography
                element="span"
                as="mutedText"
                className="flex items-center gap-2"
              >
                <LogOut />
                Average Leave Time
              </Typography>
              <Badge className="w-fit flex items-center gap-2 ml-2">
                <Clock size={15} />
                {avgLeaveTime}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <Card className="flex-1 h-full">
          <CardHeader>
            <CardTitle>Average Attendance and Leave Times</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Consequatur repellendus quia, nostrum possimus quis a corrupti
              explicabo laboriosam voluptates, recusandae sunt, accusamus
              molestias illum fuga itaque? Unde sunt quas omnis!
            </p>
          </CardContent>
        </Card> */}
      {/* <AttendanceChart /> */}
      {/* </div> */}
    </section>
  );
};

export default AttendanceStats;
