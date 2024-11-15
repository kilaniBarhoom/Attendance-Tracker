import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import { UserAvatar } from "@/components/ui/user-avatar";
import { AnalyticsOfUsersAttendancesType } from "@/pages/Main-Page/api/attendance";
import { Banknote, User } from "lucide-react";
import { useTranslation } from "react-i18next";

const UsersAttendancesAnalyticsCard = ({
  analyticsOfUsersAttendances,
  loadingToFetchAnalytics,
}: {
  analyticsOfUsersAttendances: AnalyticsOfUsersAttendancesType[];
  loadingToFetchAnalytics: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const dummyArray = Array.from({ length: 3 });

  return (
    <Card className="w-full flex-1 h-full bg-secondary border">
      <CardHeader className="p-4 bg-primary w-full border-b">
        <CardTitle className="flex gap-2 items-center"></CardTitle>
        <Typography
          element="p"
          as="h4"
          className="flex flex-col gap-2 items-center justify-center"
          color="primary"
        >
          <img
            src="/assets/analytics.png"
            alt="analytics image"
            className="w-12 object-cover"
          />
          Users Attendances Overview
        </Typography>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start overflow-auto justify-between w-full p-4 bg-primary border rounded-t-md">
          <p className="flex items-center gap-1 lg:min-w-56 min-w-44">
            <User size={20} strokeWidth={2.3} />
            {t("User")}
          </p>
          <p className="flex items-center gap-1 lg:min-w-20">{t("T. Att")}</p>
          <p className="flex items-center gap-1">
            <Banknote size={20} strokeWidth={2.3} />
            {t("T. AP")}
          </p>
        </div>
        <ul className="max-h-[105px] w-full overflow-auto border border-t-0 rounded-b-md">
          {loadingToFetchAnalytics ? (
            dummyArray.map((_) => (
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 rounded-md w-full" />
                <Skeleton className="h-8 rounded-md w-full" />
                <Skeleton className="h-8 rounded-md w-full" />
              </div>
            ))
          ) : analyticsOfUsersAttendances &&
            analyticsOfUsersAttendances.length > 0 ? (
            analyticsOfUsersAttendances.map((analytics) => (
              <li
                className="flex items-start justify-between w-full gap-2 border-b last:border-b-0 p-4"
                key={analytics?.user?.id}
              >
                <UserAvatar
                  name={
                    language === "ar"
                      ? analytics?.user?.fullNameArabic
                      : analytics?.user?.fullNameEnglish ?? ""
                  }
                  className="lg:min-w-56 min-w-44"
                  nameClassName="font-semibold lg:text-lg text-base"
                  imageClassName="lg:size-10 size-7 bg-secondary border"
                />

                <Typography element="p" as="lead" className="lg:min-w-20">
                  {analytics?.totalAttendance}
                </Typography>
                <Typography element="p" as="lead">
                  {analytics?.totalAdvancePayments}{" "}
                  <sup className="text-lg">₪</sup>
                </Typography>
              </li>
            ))
          ) : (
            <Typography
              element="p"
              className="text-center text-lg fond-bold py-5"
            >
              {t("No data found.")}
            </Typography>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UsersAttendancesAnalyticsCard;
