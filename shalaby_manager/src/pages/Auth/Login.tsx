import LoginForm from "@/components/forms/auth/login.form";
import LanguageSelect from "@/components/shared/language-select";
import ThemeSelector from "@/components/shared/theme-selector";
import { Separator } from "@/components/ui/separator";
import Typography from "@/components/ui/typography";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  return (
    <div className="h-full flex flex-col items-center justify-center gap-5">
      <Helmet>
        <title>{t("Login")}</title>
      </Helmet>
      <div className="text-center flex flex-col items-center justify-center gap-2">
        <img
          src="/assets/attendance.png"
          alt="website logo"
          className="object-cover w-20"
        />
        <Typography
          element="h2"
          as="h3"
          className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-700"
        >
          {t("Welcome Back")}
        </Typography>
        <Typography element="p" as="mutedText">
          {t("Enter your credentials to access your account")}
        </Typography>
      </div>
      <LoginForm />
      <Separator />
      <div className="flex items-center justify-between gap-2">
        <LanguageSelect />
        <ThemeSelector />
      </div>
    </div>
  );
};

export default Login;
