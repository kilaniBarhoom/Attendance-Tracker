import UsersForm from "@/components/forms/main-page/users/add-edit-form";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UsersFormSchema, UsersFormSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUsersFormMutation } from "@/pages/Main-Page/api/Users";

const AddEditUsersSheet = ({ children }: { children: React.ReactNode }) => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  //   const { data: employee, isLoading: isLoadingToFetchEmployee } =
  //     useGetEmployeeByIdQuery();

  const [isOpen, setIsOpen] = useState(false);

  const userForm = useForm<UsersFormSchemaType>({
    resolver: zodResolver(UsersFormSchema),
    defaultValues: {
      fullNameArabic: "",
      fullNameEnglish: "",
      email: "",
      phone: "",
      secondaryPhone: "",
      role: "user",
    },
  });

  const { mutateAsync } = useUsersFormMutation();

  const onSubmit = async (data: UsersFormSchemaType) => {
    try {
      await mutateAsync({
        data,
      });
      toast(t("Success"), {
        description: t("Saved Successfully"),
      });
      setIsOpen(false);
    } catch (error: any) {
      toast(t("Error"), {
        description: t(error?.response?.data?.[0]) || "",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        disableBackdrop
        className="bg-background sm:min-w-[500px] rounded-md w-full transition-all duration-300 ease-in-out"
        side={dir === "ltr" ? "right" : "left"}
      >
        <div className=" flex flex-col gap-2 overflow-auto">
          <SheetHeader className="flex-[0.3] flex-row items-center gap-2">
            <img
              src="/assets/create-user.png"
              alt="create user image"
              className="object-contain w-16"
            />
            <div className="flex flex-col">
              <SheetTitle>{t("Create a new user")}</SheetTitle>
              <SheetDescription>
                {t("Create a new user by entering user's info")}
              </SheetDescription>
            </div>
          </SheetHeader>
          <Separator />
          <UsersForm userForm={userForm} onSubmit={onSubmit} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddEditUsersSheet;
