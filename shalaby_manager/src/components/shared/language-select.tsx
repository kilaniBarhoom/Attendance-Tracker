import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Languages } from "lucide-react";

const LanguageSelect = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (data: any) => {
    i18n.changeLanguage(data);
  };
  return (
    <div className="flex h-12 items-center gap-2">
      <Button
        variant={"outline"}
        className="font-sans"
        // size="/
        Icon={Languages}
        onClick={() => changeLanguage(i18n.language === "ar" ? "en" : "ar")}
      >
        {i18n.language === "ar" ? t("English") : t("Arabic")}
      </Button>
    </div>
  );
};

export default LanguageSelect;
