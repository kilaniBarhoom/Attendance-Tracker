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
import { axios } from "@/hooks/use-axios";
import { useAuth } from "@/providers/auth-provider";
import { useError } from "@/providers/error-provider";
import { LoginFormSchema, LoginFormSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
// import LanguageSelectForm from "@/components/shared/LanguageSelect";
import ErrorAlert from "@/components/shared/error-alert";
import { ny } from "@/lib/utils";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginForm = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.state?.from?.pathname;
  const search = location.state?.from?.search;
  const from =
    pathname && !["/unauthorized"].includes(pathname)
      ? `${pathname}${search}`
      : "/attendance";
  const { user, setUser, setAccessToken } = useAuth();
  const { setError } = useError();
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const isLoading = loginForm.formState.isSubmitting;

  async function onSubmit(values: LoginFormSchemaType) {
    setError(undefined);
    try {
      const { data: response } = await axios.post(`/auth/login`, values);
      const { data } = response;
      const { user: userData, token } = data;
      const user: UserType = userData;
      setUser(user);
      setAccessToken(token);
      localStorage.setItem("isLoggedIn", "true");
      toast(t("Welcome back, {{name}}", { name: user?.fullNameArabic }), {});
      navigate(from, { replace: true });
    } catch (error: any) {
      if (error.code === "ERR_NETWORK") {
        setError({
          description: "Sorry, server unreachable at the moment.",
        });
      } else {
        console.log(error.response.data.message);
        setError({
          description: error.response.data.message,
        });
      }
    }
  }
  useEffect(() => {
    if (user) {
      navigate("/attendance");
    }
  }, []);
  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(onSubmit)}
        className="flex flex-col text-start gap-3 w-full"
      >
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-red-500">*</span>
                {t("Email")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="email"
                  className="hover:bg-secondary hover:border-secondary-foreground"
                  defaultValue="ibrahim-kelani@hotmail.com"
                  icon={<Mail size={20} />}
                  placeholder="john@doe.com"
                />
              </FormControl>
              <FormMessage className="text-start" />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-red-500">*</span>
                {t("Password")}
              </FormLabel>
              <FormControl>
                <Trans i18nKey={"passwordInput"}>
                  <div className="relative">
                    <Input
                      className="hover:bg-secondary hover:border-secondary-foreground"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      autoComplete="password"
                      placeholder="********"
                      defaultValue="55555555"
                      icon={<Lock size={20} />}
                    />
                    {showPassword ? (
                      <Eye
                        onClick={() => setShowPassword(false)}
                        size={23}
                        className={ny("cursor-pointer absolute top-2", {
                          "right-3": dir === "ltr",
                          "left-3": dir === "rtl",
                        })}
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShowPassword(true)}
                        size={23}
                        className={ny("cursor-pointer absolute top-2", {
                          "right-3": dir === "ltr",
                          "left-3": dir === "rtl",
                        })}
                      />
                    )}
                  </div>
                </Trans>
              </FormControl>
              <FormMessage className="text-start" />
              <div className="text-end">
                <Button variant={"link"} size={"link"}>
                  {t("Forgot your password?")}
                </Button>
              </div>
            </FormItem>
          )}
        />
        <ErrorAlert />
        <Button
          className="w-full mt-4"
          type="submit"
          disabled={isLoading}
          loading={isLoading}
        >
          {t("Login")}
        </Button>
      </form>
    </Form>
    // <div className="w-fit mt-6">
    //   {/* <LanguageSelectForm className="lg:w-1/2 text-white hover:text-white text-lg" /> */}
    // </div>
  );
};

export default LoginForm;
