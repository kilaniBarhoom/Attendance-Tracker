import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { useUsersChangeRoleFormMutation } from "../../api/Users";
import { useState } from "react";
import { UserAvatar } from "@/components/ui/user-avatar";

const ChangeRoleFormSchema = z.object({
  role: z.string({
    required_error: "Please choose role.",
  }),
});

const ChangeRoleDialog = ({
  user,
  children,
}: {
  user: UserType;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const changeRoleForm = useForm<z.infer<typeof ChangeRoleFormSchema>>({
    resolver: zodResolver(ChangeRoleFormSchema),
    defaultValues: {
      role: user.role ?? "user",
    },
  });

  const { mutateAsync } = useUsersChangeRoleFormMutation();

  function onSubmit(data: z.infer<typeof ChangeRoleFormSchema>) {
    try {
      mutateAsync({
        data: {
          role: data.role,
        },
        userId: user.id,
      });
      toast(t("Role Changed"));
      setIsOpen(false);
    } catch (error) {
      toast("Something went wrong");
    }
  }

  const loading = changeRoleForm.formState.isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[25rem]">
        <DialogHeader className="p-4 flex-row items-center gap-2">
          <img
            src="/assets/user-role.png"
            alt="change user role image"
            className="object-contain w-12"
          />
          <div className="gap-1 flex flex-col items-start">
            <DialogTitle>
              {t("Change Role")} (
              {language === "ar" ? user.fullNameArabic : user.fullNameEnglish})
            </DialogTitle>
            <DialogDescription>
              {t("Change the role of the user")}
            </DialogDescription>
          </div>
          <br />
        </DialogHeader>
        <div className="p-4 pb-0">
          <UserAvatar
            name={
              language === "ar"
                ? user.fullNameArabic
                : user.fullNameEnglish ?? ""
            }
            description={user.email}
            imageClassName="bg-background border size-10 "
            className="border border-primary bg-secondary p-2 w-full rounded-md"
            descriptionType="email"
            nameClassName="text-base"
          />
        </div>
        <Form {...changeRoleForm}>
          <form
            onSubmit={changeRoleForm.handleSubmit(onSubmit)}
            className="w-full h-full flex items-center gap-2 p-4"
          >
            <FormField
              control={changeRoleForm.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="spectator">Spectator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              loading={loading}
              disabled={loading}
              type="submit"
              className="flex-[0.3]"
            >
              {t("Change")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRoleDialog;
