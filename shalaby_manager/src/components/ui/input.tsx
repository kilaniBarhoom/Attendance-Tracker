import * as React from "react";

import { ny } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useTranslation } from "react-i18next";

const InputVariants = cva("relative", {
  variants: {
    iconPosition: {
      left: " absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground",
      right:
        " absolute left-auto right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground",
    },
  },
  defaultVariants: {
    iconPosition: "left",
  },
});

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof InputVariants> {
  icon?: JSX.Element;
  error?: boolean;
  noRing?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconPosition, error, noRing, ...props }, ref) => {
    const { i18n } = useTranslation();
    iconPosition = i18n.dir() === "rtl" ? "right" : "left";
    return (
      <>
        {icon ? (
          <div className="relative inline-block w-full h-10">
            {iconPosition !== "right" && (
              <span className={ny(InputVariants({ iconPosition }))}>
                {icon}
              </span>
            )}
            <input
              type={type}
              className={ny(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/80 text-foreground shadow-inner focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                className,
                iconPosition !== "right" ? "pl-10 pr-4" : "pl-4 pr-10",
                error ? "border-destructive" : "",
                noRing
                  ? ""
                  : "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
              ref={ref}
              {...props}
            />
            {iconPosition === "right" && (
              <span className={ny(InputVariants({ iconPosition }))}>
                {icon}
              </span>
            )}
          </div>
        ) : (
          <input
            type={type}
            className={ny(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/80 text-foreground shadow-inner focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              className,
              error ? "border-destructive" : "",
              noRing
                ? ""
                : "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            ref={ref}
            {...props}
          />
        )}
      </>
    );
  }
);
Input.displayName = "Input";
export { Input };
