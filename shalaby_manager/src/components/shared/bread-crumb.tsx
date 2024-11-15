import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ny } from "@/lib/utils";
import { Slash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type TreeT = {
  title?: string;
  link?: string;
};

const BreadcrumbComponent = ({
  tree,
  currentPage,
  className,
}: {
  tree: TreeT[];
  currentPage?: string;
  className?: string;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div
      className={ny(
        "mb-1  z-30 transition-all duration-300 ease-in-out",
        className
      )}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="cursor-pointer text-sm font-semibold"
              onClick={() => navigate("/attendance")} // Add a conditional operator to provide a default value if item.link is undefined
            >
              {t("Home")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="ltr:ml-2 rtl:mr-2">
            <Slash className="-rotate-12" size={18} />
          </BreadcrumbSeparator>
          {tree?.map((item, index) => (
            <div className="flex items-center" key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="cursor-pointer text-sm font-semibold"
                  onClick={() => navigate(item.link || "")} // Add a conditional operator to provide a default value if item.link is undefined
                >
                  {t(`${item.title}`)}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="ltr:ml-2 rtl:mr-2">
                <Slash className="-rotate-12" size={18} />
              </BreadcrumbSeparator>
            </div>
          ))}
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-semibold">
              {t(`${currentPage}`)}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbComponent;
