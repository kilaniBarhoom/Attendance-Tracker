import { ny } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={ny(
        "dark:bg-primary/10 bg-secondary animate-pulse rounded-md",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
