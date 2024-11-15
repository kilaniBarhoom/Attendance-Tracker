import { DatePicker } from "@/components/shared/date-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ny, stringToDate } from "@/lib/utils";
import { format } from "date-fns";
import { ar, enGB } from "date-fns/locale";
import { MoveRight, CalendarIcon, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import Typography from "@/components/ui/typography";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  useAuth,
  UserGroupsType,
} from "@/providers/auth-provider";
import Loading from "@/components/shared/loading";
import { UserAvatar } from "@/components/ui/user-avatar";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { TimePickerInput } from "@/components/ui/time-picker";

type AttendanceFormProps = {
  attendanceForm: any;
  isLoading: boolean;
  onSubmit: any;
  attendance?: AttendanceType;
};

const AttendanceForm = ({
  attendanceForm,
  isLoading,
  onSubmit,
  attendance,
}: AttendanceFormProps) => {
  const { accessToken } = useAuth();

  const [groupedUsers, setGroupedUsers] = useState<UserGroupsType[] | null>([]);
  const [loadigToGetUsers, setLoadingToGetUsers] = useState(false);

  useEffect(() => {
    const getUsersInGroups = async () => {
      try {
        setLoadingToGetUsers(true);
        const users = await getAllUsers(accessToken ?? "");
        setGroupedUsers(users);
      } catch {
        setGroupedUsers([]);
      } finally {
        setLoadingToGetUsers(false);
      }
    };
    getUsersInGroups();
  }, []);

  const { t, i18n } = useTranslation();
  const language = i18n.language;
  return (
    <Form {...attendanceForm}>
      <form
        onSubmit={attendanceForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-10"
      >
        <div className={ny("flex flex-col gap-y-3")}>
          <FormField
            control={attendanceForm.control}
            name="user"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-red-500">*</span>&nbsp;{t("User")}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="User" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent nopadding>
                    {loadigToGetUsers ? (
                      <Loading />
                    ) : (
                      groupedUsers &&
                      groupedUsers?.map((group) => (
                        <SelectGroup
                          key={group.role}
                          className="border-b p-1 last:border-b-0"
                        >
                          <SelectLabel>{group.role}</SelectLabel>
                          {group.users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex items-center gap-2">
                                <UserAvatar
                                  imageClassName="border bg-secondary"
                                  name={
                                    language === "ar"
                                      ? user.fullNameArabic
                                      : user.fullNameEnglish ?? ""
                                  }
                                  description={user.email}
                                />
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-start w-full gap-2">
            <FormField
              control={attendanceForm.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>
                    <span className="text-red-500">*</span>&nbsp;
                    {t("Date")}
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onSelect={(value: Date) => {
                        field.onChange(value);
                      }}
                    >
                      <Button
                        variant={"outline"}
                        className={ny(
                          "pl-3 text-left font-semibold text-base flex-1 w-full",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(stringToDate(field.value), "dd/LL/y", {
                            locale: language === "ar" ? ar : enGB,
                          })
                        ) : (
                          <span>{t("Permit Expiration Date")}</span>
                        )}
                        <CalendarIcon className="ltr:ml-auto rtl:mr-auto h-4 w-4 opacity-50" />
                      </Button>
                    </DatePicker>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={attendanceForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-red-500">*</span>&nbsp;{t("Status")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="flex-1 w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="present">
                        <div className="flex items-center gap-2">
                          <Badge
                            className="bg-green-500 justify-start rounded-md p-1 h-6"
                            size={"sm"}
                          >
                            <Check size={16} strokeWidth={3} />
                          </Badge>
                          <Typography element="span">Present</Typography>
                        </div>
                      </SelectItem>
                      <SelectItem value="absent">
                        <div className="flex items-center gap-2">
                          <Badge
                            className="bg-red-500 justify-start rounded-md p-1 h-6"
                            size={"sm"}
                          >
                            <X size={16} strokeWidth={3} />
                          </Badge>
                          <Typography element="span">Absent</Typography>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2 flex-1 border justify-start items-start p-2 rounded-md bg-green-700">
              <Typography
                element="label"
                className="w-full leading-2 flex items-center justify-between"
                as="smallText"
                color="white"
              >
                Attendance Time&nbsp; &nbsp;
                <Button
                  className="py-1 ml-auto px-2 h-fit text-xs"
                  type="button"
                >
                  now
                </Button>
              </Typography>
              <div className="flex gap-2 items-center">
                <TimePickerInput picker="hours" id="hours" />
                :
                <TimePickerInput picker="minutes" id="minutes" />
              </div>
            </div>
            <Typography element="span" className="text-muted-foreground">
              <MoveRight size={24} />
            </Typography>
            <div className="flex flex-col gap-2 flex-1 border justify-start items-start p-2 rounded-md bg-red-700">
              <Typography
                element="label"
                className="w-full leading-2 flex items-center justify-between"
                as="smallText"
                color="white"
              >
                Leave Time&nbsp; &nbsp;
                <Button
                  className="py-1 ml-auto px-2 h-fit text-xs"
                  type="button"
                >
                  now
                </Button>
              </Typography>
              <div className="flex gap-2 items-center">
                <TimePickerInput picker="hours" id="hours" />
                :
                <TimePickerInput picker="minutes" id="minutes" />
              </div>
            </div>
          </div>

          <FormField
            control={attendanceForm.control}
            name="advancePayment"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("Advance Payment")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    autoComplete="advancePayment"
                    error={
                      !!attendanceForm.formState.errors.advancePayment?.message
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={attendanceForm.control}
            name="note"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormLabel>{t("Note")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    autoComplete="note"
                    className="h-32"
                    // error={!!attendanceForm.formState.errors.note?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="flex items-center gap-2 p-2 justify-end w-full">
          <DialogClose asChild>
            <Button
              type="button"
              className="md:w-fit w-full"
              variant={"outline"}
            >
              {t("Discard")}
            </Button>
          </DialogClose>
          <Button
            loading={isLoading}
            disabled={isLoading}
            type="submit"
            className="px-8 md:w-fit w-full"
          >
            {attendance ? t("Save") : t("Add")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AttendanceForm;
