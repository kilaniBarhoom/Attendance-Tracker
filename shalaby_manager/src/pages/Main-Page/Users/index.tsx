import BreadcrumbComponent from "@/components/shared/bread-crumb";
import { Button } from "@/components/ui/button";
import { UserPlus, Users2 } from "lucide-react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import UsersWrapper from "../components/users/users-wrapper";
import Typography from "@/components/ui/typography";
import AddUsersSheet from "../components/users/add-sheet";
import AuthorizedRender from "@/components/shared/authorized-conditional-render";

const Users = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <Helmet>
        <title>Users</title>
      </Helmet>
      <BreadcrumbComponent
        tree={[
          {
            title: "Users",
          },
        ]}
        currentPage={"All"}
      />
      <div className="w-full flex items-center justify-between gap-2">
        <Typography
          className="flex items-center gap-2 pageTitle"
          element="h4"
          as="h4"
          color="secondary"
        >
          <Users2 size={25} />
          {t("Users")}
        </Typography>
        <AuthorizedRender authorizedRoles={["superadmin", "admin"]}>
          <AddUsersSheet>
            <Button className="px-6 border" Icon={UserPlus}>
              {t("Create User")}
            </Button>
          </AddUsersSheet>
        </AuthorizedRender>
      </div>
      <UsersWrapper />
    </div>
  );
};

export default Users;
