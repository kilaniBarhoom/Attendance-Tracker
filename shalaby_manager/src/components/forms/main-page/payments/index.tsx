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
import { CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  useAuth,
  UserGroupsType,
} from "@/providers/auth-provider";
import Loading from "@/components/shared/loading";
import { UserAvatar } from "@/components/ui/user-avatar";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

type PaymentFormProps = {
  paymentForm: any;
  isLoading: boolean;
  onSubmit: any;
  payment?: PaymentType;
};

const AttendanceForm = ({
  paymentForm,
  isLoading,
  onSubmit,
  payment,
}: PaymentFormProps) => {
  const { accessToken } = useAuth();

  const [loadigToGetUsers, setLoadingToGetUsers] = useState(false);
  const [groupedUsers, setGroupedUsers] = useState<UserGroupsType[] | null>(
    null
  );

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
  const dir = i18n.dir();
  return (
    <Form {...paymentForm}>
      <form
        onSubmit={paymentForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-10"
      >
        <div className={ny("flex flex-col gap-y-3")}>
          <FormField
            control={paymentForm.control}
            name="user"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-red-500">*</span>&nbsp;{t("User")}
                </FormLabel>
                <Select
                  dir={dir}
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
          <FormField
            control={paymentForm.control}
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
                        "pl-3 text-left font-semibold text-base flex-1 w-full hover:scale-100 active:scale-100",
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
          <div className="flex items-start w-full gap-2">
            <FormField
              control={paymentForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <span className="text-red-500">*</span>&nbsp;{t("Amount")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      autoComplete="amount"
                      error={!!paymentForm.formState.errors.amount?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={paymentForm.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <span className="text-red-500">*</span>&nbsp;{t("Type")}
                  </FormLabel>
                  <Select
                    dir={dir}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full">{t("Full")}</SelectItem>
                      <SelectItem value="advance">
                        {t("Advance Payment")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={paymentForm.control}
            name="note"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormLabel>{t("Note")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    autoComplete="note"
                    className="h-32"
                    // error={!!paymentForm.formState.errors.note?.message}
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
            {payment ? t("Save") : t("Add")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AttendanceForm;
