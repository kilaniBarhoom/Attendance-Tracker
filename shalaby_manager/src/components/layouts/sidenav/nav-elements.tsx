import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { NavItem, SideNavItems } from "./nav-items";
import { ny } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { Dispatch, SetStateAction } from "react";

const NavElements = ({
  setOpen,
}: {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  return (
    <nav className="flex flex-col gap-2">
      {SideNavItems.map(
        (item: NavItem) =>
          !item?.unAuthorizedRoles?.includes(user?.role ?? "") && (
            <Link
              to={item.path}
              key={item.title}
              onClick={() => {
                setOpen?.(false);
              }}
              className={ny(
                buttonVariants({
                  variant: pathname === item.path ? "default" : "secondary",
                  size: "lg",
                }),
                "justify-between flex gap-2 p-2  h-12 group border-primary items-center text-lg border font-semibold ltr:border-l-[7px] rtl:border-r-[7px]"
              )}
            >
              {t(item.title)}
              {item.icon}
            </Link>
          )
      )}
    </nav>
  );
};

export default NavElements;
