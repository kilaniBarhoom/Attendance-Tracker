import { VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { ny } from "@/lib/utils";

const typographyVariants = cva("text-secondary-foreground", {
  variants: {
    as: {
      h1: "scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-7xl capitalize",
      h2: "scroll-m-20  pb-2 md:text-6xl text-4xl font-bold tracking-tight capitalize first:mt-0",
      h3: "scroll-m-20 md:text-4xl text-2xl font-bold tracking-tight",
      h4: "scroll-m-20 md:text-2xl text-lg font-semibold tracking-tight",
      h5: "scroll-m-20 md:text-lg text-sm font-semibold tracking-tight",
      h6: "scroll-m-20 md:text-base text-xs font-semibold tracking-tight",
      p: "leading-7 md:text-lg text-sm",
      blockquote: "mt-6 pl-6 italic",
      ul: "my-6 ml-6 list-disc [&>li]:mt-2",
      inlineCode:
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl font-bold",
      largeText: "text-lg font-semibold",
      smallText: "md:text-sm text-xs leading-2",
      extraSmallText: "text-[10px] font-light",
      mutedText: "text-muted-foreground",
    },
    color: {
      primary: "text-primary-foreground",
      muted: "text-muted-foreground",
      secondary: "text-secondary-foreground",
      white: "text-white",
      black: "text-black",
      success: "text-green-500",
      error: "text-red-500",
      warning: "text-yellow-500",
    },
  },
});

type Element = keyof JSX.IntrinsicElements;

type TypographyProps<T extends Element> = {
  element: T;
} & VariantProps<typeof typographyVariants> &
  React.HTMLAttributes<HTMLElement>;

const Typography = <T extends Element>({
  className,
  element,
  as,
  color,
  ...props
}: TypographyProps<T>) => {
  const Component = element;

  const componentProps = {
    className: ny(typographyVariants({ as, color, className })),
    ...props,
  };

  return React.createElement(Component, componentProps);
};

export default React.forwardRef(Typography);
