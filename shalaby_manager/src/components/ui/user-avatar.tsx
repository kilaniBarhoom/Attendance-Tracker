import { ny } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { buttonVariants } from "./button";

type UserAvatarProps = {
  name?: string;
  image?: string | undefined;
  description?: string;
  imageClassName?: string;
  nameClassName?: string;
  descriptionType?: "email" | "string";
  className?: string;
};
const UserAvatar = ({
  name,
  description = "",
  image = "",
  imageClassName,
  nameClassName,
  descriptionType = "string",
  className,
}: UserAvatarProps) => {
  const { t } = useTranslation();
  return (
    <div className={ny("flex gap-2", className)}>
      <Avatar className={ny("size-7", imageClassName)}>
        <AvatarImage src={image} alt={name} />
        <AvatarFallback className="bg-smoked">
          {name?.[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start justify-center gap-1">
        <p
          className={ny(
            "leading-none text-secondary-foreground text-xs font-medium",
            nameClassName
          )}
        >
          {name}
        </p>
        {descriptionType === "email" ? (
          <a
            href={`mailto:${description ?? ""}`}
            className={ny(
              buttonVariants({ variant: "link" }),
              "p-0 h-fit font-sans"
            )}
          >
            {description}
          </a>
        ) : (
          <p className="text-xs leading-none text-muted-foreground">
            {t(`${description ?? ""}`)}
          </p>
        )}
      </div>
    </div>
  );
};

export { UserAvatar };
