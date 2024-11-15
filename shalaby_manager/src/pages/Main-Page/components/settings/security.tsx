import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { changePassword } from "@/providers/auth-provider";
import {
  ChangePasswordFormSchema,
  ChangePasswordFormSchemaType,
} from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const Security = () => {
  const { t, i18n } = useTranslation();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const language = i18n.language;

  const changePasswordForm = useForm<ChangePasswordFormSchemaType>({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const isLoading = changePasswordForm.formState.isSubmitting;

  // const { mutateAsync } = useAttendanceFormMutation();

  const onSubmit = async (data: ChangePasswordFormSchemaType) => {
    console.log(data);
    // try {
    //   await changePassword({
    //     oldPassword: data.oldPassword,
    //     newPassword: data.newPassword,
    //   });
    //   toast({
    //     title: t("Success"),
    //     description: t("Saved Successfully"),
    //   });
    // } catch (error: any) {
    //   toast({
    //     title: t("Error"),
    //     description: t(error?.response?.data?.[0]) || "",
    //   });
    // }
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-secondary w-full justify-start ltr:text-left rtl:text-right rounded-md flex flex-col gap-5 p-4">
        <Form {...changePasswordForm}>
          <form
            onSubmit={changePasswordForm.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-3"
          >
            <FormField
              control={changePasswordForm.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>
                    {t("Old Password")}
                    <span className="text-secondary-foreground">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      icon={
                        showOldPassword ? (
                          <Eye
                            onClick={() => {
                              setShowOldPassword(false);
                            }}
                          />
                        ) : (
                          <EyeOff
                            onClick={() => {
                              setShowOldPassword(true);
                            }}
                          />
                        )
                      }
                      iconPosition={language === "ar" ? "left" : "right"}
                      type={showOldPassword ? "text" : "password"}
                      autoComplete="oldPassword"
                      error={
                        !!changePasswordForm.formState.errors.oldPassword
                          ?.message
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={changePasswordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>
                    {t("New Password")}
                    <span className="text-secondary-foreground">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      icon={
                        showNewPassword ? (
                          <Eye
                            onClick={() => {
                              setShowNewPassword(false);
                            }}
                          />
                        ) : (
                          <EyeOff
                            onClick={() => {
                              setShowNewPassword(true);
                            }}
                          />
                        )
                      }
                      iconPosition={language === "ar" ? "left" : "right"}
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="newPassword"
                      error={
                        !!changePasswordForm.formState.errors.newPassword
                          ?.message
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={changePasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>
                    {t("Confirm Password")}
                    <span className="text-secondary-foreground">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      icon={
                        showConfirmPassword ? (
                          <Eye
                            onClick={() => {
                              setShowConfirmPassword(false);
                            }}
                          />
                        ) : (
                          <EyeOff
                            onClick={() => {
                              setShowConfirmPassword(true);
                            }}
                          />
                        )
                      }
                      iconPosition={language === "ar" ? "left" : "right"}
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="confirmPassword"
                      error={
                        !!changePasswordForm.formState.errors.confirmPassword
                          ?.message
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-3 mt-5">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  changePasswordForm.reset();
                  changePasswordForm.clearErrors();
                }}
              >
                {t("Reset")}
              </Button>
              <Button
                className="w-full"
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                {t("Save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Security;
