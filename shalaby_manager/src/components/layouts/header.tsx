import { LogOut, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useLogout } from "@/providers/auth-provider";
import { useNavigate } from "react-router-dom";

import SideNavSheet from "./sidenav/side-nav-sheet";
import ThemeSelector from "../shared/theme-selector";
import LanguageSelect from "../shared/language-select";
import { useTranslation } from "react-i18next";

const Header = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    const isConfirmed = confirm(t("Are you sure you want to logout?"));
    if (isConfirmed) {
      await logout();
      navigate("/");
    }
  };
  return (
    <>
      <div className="flex items-center gap-2">
        <SideNavSheet>
          <Button className="lg:hidden flex" size="icon" variant="secondary">
            <Menu />
          </Button>
        </SideNavSheet>
        <LanguageSelect />
      </div>
      <div className="flex items-center gap-2">
        <ThemeSelector />
        <Button onClick={handleLogout} variant={"destructive"} Icon={LogOut}>
          {t("Log Out")}
        </Button>
      </div>
    </>
  );
};

export default Header;
