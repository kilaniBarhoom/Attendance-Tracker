import { TableCell, TableRow } from "@/components/ui/table";
import Typography from "@/components/ui/typography";
import { useTranslation } from "react-i18next";

import AuthorizedRender from "@/components/shared/authorized-conditional-render";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import {
  UserRolesResponseType,
  UsersResponseType,
  useToggleUserActivationMutation,
} from "@/pages/Main-Page/api/Users";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ny } from "@/lib/utils";
import { Copy, Pen } from "lucide-react";
import { toast } from "sonner";
import EditUsersSheet from "../edit-sheet";
import { useRef } from "react";
import ChangeRoleDialog from "../change-role";
import { UserAvatar } from "@/components/ui/user-avatar";

const TableRows = ({
  userResponse,
}: {
  userResponse?: UserRolesResponseType[] | UsersResponseType[];
}) => {
  const phoneRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

  const { i18n } = useTranslation();
  const { user: loggedInUser } = useAuth();
  const language = i18n.language;

  const [searchParams] = useSearchParams();
  const grouped = searchParams.get("grouped") || "false";

  const users = userResponse as UsersResponseType[];
  const groupedUsers = userResponse as UserRolesResponseType[];

  // const { mutate: deleteCost } = useDeleteCostMutation();

  const RenderUserRows = (users: UserType[]) => {
    return users.map((user) => (
      <TableRow
        key={user.id}
        className={ny(
          {
            "bg-green-300/40 hover:bg-green-300/30":
              user?.id === loggedInUser?.id,
          },
          "cursor-pointer"
        )}
      >
        <TableCell className="min-w-max">
          <Typography element="p" className="font-semibold">
            <UserAvatar
              name={
                language === "ar"
                  ? user?.fullNameArabic
                  : user?.fullNameEnglish ?? ""
              }
              className="border rounded-md px-2 py-1 bg-secondary"
              imageClassName="size-8 bg-background border"
            />
          </Typography>
        </TableCell>
        <TableCell className="max-w-max">
          <Button variant="link" size="link">
            {user.email}
          </Button>
        </TableCell>
        <TableCell className="min-w-max">
          {(!!user.phone || !!user.secondaryPhone) && (
            <Typography
              element="span"
              as="largeText"
              className="text-blue-500 font-base flex items-center gap-2"
            >
              <span ref={(el) => phoneRefs.current.set(user.id, el!)}>
                {user.phone ?? user.secondaryPhone}
              </span>
              <Copy
                size={20}
                className="cursor-pointer text-secondary-foreground"
                onClick={() => {
                  const phoneElement = phoneRefs.current.get(user.id);
                  if (phoneElement) {
                    navigator.clipboard.writeText(phoneElement.innerText);
                    toast("Copied");
                  }
                }}
              />
            </Typography>
          )}
        </TableCell>
        <TableCell className="max-w-10">
          <AuthorizedRender
            authorizedRoles={["superadmin"]}
            replacement={
              <Badge
                variant={"leftBordered"}
                className={ny({
                  "border-blue-500": user?.role === "superadmin",
                  "border-primary": user?.role === "admin",
                  "border-green-700": user?.role === "user",
                  "border-yellow-500": user?.role === "spectator",
                })}
              >
                {user?.role}
              </Badge>
            }
          >
            <ChangeRoleDialog user={user}>
              <Badge
                variant={"leftBordered"}
                className={ny({
                  "border-blue-500": user?.role === "superadmin",
                  "border-primary": user?.role === "admin",
                  "border-green-700": user?.role === "user",
                  "border-yellow-500": user?.role === "spectator",
                })}
              >
                {user?.role}
              </Badge>
            </ChangeRoleDialog>
          </AuthorizedRender>
        </TableCell>
        <AuthorizedRender authorizedRoles={["superadmin"]}>
          <TableCell className="min-w-60">
            <div className="flex gap-2 justify-end w-full">
              <EditUsersSheet user={user}>
                <Button
                  className="bg-primary text-black hover:bg-primary w-fit py-1 px-2 h-8"
                  variant={"secondary"}
                >
                  <Pen size={18} />
                </Button>
              </EditUsersSheet>
              <DeactivationButton user={user} loggedInUser={loggedInUser} />
            </div>
          </TableCell>
        </AuthorizedRender>
      </TableRow>
    ));
  };
  return (
    <>
      {userResponse && userResponse.length > 0 && grouped === "false"
        ? RenderUserRows(users)
        : groupedUsers.map(({ role, users }) => (
            <>
              <TableRow key={role} className="bg-primary/60">
                <TableCell colSpan={5}>
                  <Typography
                    element="p"
                    as="lead"
                    color="secondary"
                    className="capitalize text-center"
                  >
                    {role}
                  </Typography>
                </TableCell>
              </TableRow>
              {RenderUserRows(users)}
            </>
          ))}
    </>
  );
};

export default TableRows;

const DeactivationButton = ({
  user,
  loggedInUser,
}: {
  user: UserType;
  loggedInUser?: UserType;
}) => {
  const { t } = useTranslation();

  const { mutateAsync, isPending: isLoadingToToggleActivation } =
    useToggleUserActivationMutation();

  const handleUserActivation = async (userId: string) => {
    const isSettled = confirm(
      t("Are you sure you want to toggle activation for this user?")
    );
    if (!isSettled) return;
    try {
      await mutateAsync({
        userId: userId,
      });
    } catch (error) {
      toast("Something went wrong");
    }
  };
  return (
    <Button
      loading={isLoadingToToggleActivation}
      onClick={() => handleUserActivation(user?.id)}
      disabled={user?.id === loggedInUser?.id || isLoadingToToggleActivation}
      size="sm"
      variant={user?.active ? "destructive" : "success"}
      className="w-24"
    >
      {user?.active ? t("Deactivate") : t("Activate")}
    </Button>
  );
};
