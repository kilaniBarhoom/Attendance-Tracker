import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";

import { ny } from "@/lib/utils";
import type { ButtonProps } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={ny("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={ny("flex flex-row items-center gap-2", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={ny("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={ny(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}
PaginationLink.displayName = "PaginationLink";

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const { i18n } = useTranslation();
  const dir = i18n.dir();
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={ny(className)}
      {...props}
    >
      {dir === "rtl" && <ChevronRightIcon className="size-6" />}
      {dir === "ltr" && <ChevronLeftIcon className="size-6" />}{" "}
    </PaginationLink>
  );
}
PaginationPrevious.displayName = "PaginationPrevious";

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const { i18n } = useTranslation();
  const dir = i18n.dir();
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={ny(className)}
      {...props}
    >
      {dir === "ltr" && <ChevronRightIcon className="size-6" />}
      {dir === "rtl" && <ChevronLeftIcon className="size-6" />}
    </PaginationLink>
  );
}
PaginationNext.displayName = "PaginationNext";

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={ny("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <DotsHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
