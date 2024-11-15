import BreadcrumbComponent from "@/components/shared/bread-crumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Typography from "@/components/ui/typography";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Security from "../components/settings/security";

const Settings = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <BreadcrumbComponent
        tree={[{ title: "Settings" }]}
        currentPage="Security"
      />
      <div className="w-full flex flex-col gap-y-10">
        <Typography element="h3" as="h3" color="secondary">
          {t("Settings")}
        </Typography>
        <Tabs
          defaultValue="security"
          className="w-full bg-background  max-w-screen-sm mx-auto"
          orientation="vertical"
        >
          <TabsList className="justify-start flex rtl:flex-row-reverse items-start text-start bg-background">
            <TabsTrigger value="security" className="w-fit p-0 text-lg">
              {t("Security")}
            </TabsTrigger>
            {/* <TabsTrigger value="each" className="w-fit p-0">
              {t("Each")}
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="security">
            <Typography element="h4" as={"h4"}>
              <Security />
            </Typography>
          </TabsContent>
          {/* <TabsContent value="each">
            <Typography element="h4" as={"h4"}>
              {t("Comming soon.")}
            </Typography>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
