import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ny } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
const UsersForm = ({
  user,
  userForm,
  onSubmit,
}: {
  user?: UserType;
  userForm: UseFormReturn<any>;
  onSubmit: (data: any) => void;
}) => {
  const { t } = useTranslation();
  const isLoading = userForm.formState.isSubmitting;

  return (
    <Form {...userForm}>
      <form
        onSubmit={userForm.handleSubmit(onSubmit)}
        className="flex flex-col p-4 gap-y-10"
      >
        <div className={ny("flex flex-col gap-y-5")}>
          <div className="flex gap-2 w-full">
            <FormField
              control={userForm.control}
              name="fullNameEnglish"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>
                    <span className="text-red-500">*</span>&nbsp;
                    {t("Full Name In English")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      autoComplete="fullNameEnglish"
                      error={
                        !!userForm.formState.errors.fullNameEnglish?.message
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={userForm.control}
              name="fullNameArabic"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>
                    <span className="text-red-500">*</span>&nbsp;
                    {t("Full Name In Arabic")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="جون دو"
                      autoComplete="fullNameArabic"
                      error={
                        !!userForm.formState.errors.fullNameArabic?.message
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <FormField
            control={userForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormLabel>
                  <span className="text-red-500">*</span>&nbsp;
                  {t("Email")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="johndoe@gmail.com"
                    autoComplete="email"
                    error={!!userForm.formState.errors.email?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={userForm.control}
            name="role"
            render={({ field }) => (
              <FormItem hidden>
                <FormLabel>
                  <span className="text-red-500">*</span>&nbsp;
                  {t("Role")}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!user && (
            <FormField
              control={userForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>
                    <span className="text-red-500">*</span>&nbsp;
                    {t("Password")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="********"
                      autoComplete="password"
                      error={!!userForm.formState.errors.email?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Separator />
          <div className="flex gap-2 w-full">
            <FormField
              control={userForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>{t("Phone")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="1234567890"
                      autoComplete="phone"
                      error={!!userForm.formState.errors.phone?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={userForm.control}
              name="secondaryPhone"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>{t("Secondary Phone")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="1234567890"
                      autoComplete="secondaryPhone"
                      error={
                        !!userForm.formState.errors.secondaryPhone?.message
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />
        <div className="flex items-center gap-3 justify-end">
          <SheetClose asChild>
            <Button
              className=" w-full"
              variant="outline"
              onClick={() => userForm.reset()}
            >
              {t("Discard")}
            </Button>
          </SheetClose>
          <Button
            className=" w-full"
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            {t("Save")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UsersForm;
