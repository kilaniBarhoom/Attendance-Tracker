import { useAuth } from "@/providers/auth-provider";
import NavElements from "./nav-elements";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Typography from "@/components/ui/typography";
import { useTranslation } from "react-i18next";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { format } from "date-fns";
import { ar, enGB } from "date-fns/locale";

const SideNav = ({
  setOpen,
}: {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col bg-primary/50 rounded-md border w-full">
        <div className="flex flex-col w-full py-2 gap-2 items-center justify-center">
          <Avatar className="size-28">
            <AvatarImage src="/assets/userprofile.png" />
            <AvatarFallback>
              {user?.fullNameEnglish?.[0]?.toString().toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Typography element="p" as="smallText" className="font-black">
            {t("Welcome")},&nbsp;
            {lang === "ar" ? user?.fullNameArabic : user?.fullNameEnglish}
          </Typography>
        </div>
        <div className="w-full px-2 py-1 bg-green-500 rounded-b-md">
          <Typography
            element="span"
            as="smallText"
            className="font-semibold text-center flex justify-center items-center"
            color="black"
          >
            {format(currentTime, "eee, dd/MM/y, HH:mm", {
              locale: lang === "ar" ? ar : enGB,
            })}
          </Typography>
        </div>
      </div>
      <NavElements setOpen={setOpen} />
    </div>
  );
};

export default SideNav;
