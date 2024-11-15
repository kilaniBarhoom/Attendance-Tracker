import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  UserRolesResponseType,
  UsersResponseType,
} from "@/pages/Main-Page/api/Users";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useTranslation } from "react-i18next";
import { ArrowUpDown } from "lucide-react";

const UsersFilters = ({
  usersResponse,
}: {
  usersResponse: UsersResponseType[] | UserRolesResponseType[];
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const grouped = searchParams.get("grouped") || "false";
  const users = usersResponse as UsersResponseType[];
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-max" Icon={ArrowUpDown}>
            {t("Filter Users")}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72">
          <div className="grid gap-2">
            <h5 className="font-medium leading-none">{t("Filter Users")}</h5>
            <Separator />
            <div className="grid gap-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-2">
                  <Checkbox
                    id={user.id}
                    defaultChecked={true}
                    onCheckedChange={(checked) => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set(user.id, checked.toString() ?? "false");
                      setSearchParams(newParams);
                    }}
                  />
                  <Label
                    htmlFor={user.id}
                    className="p-2 rounded-md bg-secondary w-full"
                  >
                    <UserAvatar
                      imageClassName="bg-background border"
                      name={
                        language === "ar"
                          ? user?.fullNameArabic
                          : user?.fullNameEnglish ?? ""
                      }
                      description={user?.email}
                    />
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex items-center gap-1 border p-2 h-full rounded-sm">
        <Checkbox
          id="group"
          defaultChecked={grouped === "true"}
          onCheckedChange={(checked) => {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("grouped", checked.toString() ?? "false");
            setSearchParams(newParams);
          }}
        />

        <Label htmlFor="group">{t("Grouped")}</Label>
      </div>
    </div>
  );
};

export default UsersFilters;
